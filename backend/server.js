const express = require("express");
const cors = require("cors");
const { buildSystemPrompt, getScenesPayload } = require("./prompt");
const { SCHOOL_ROLES } = require("./school");

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" })); // 多图 OCR base64 合并后体积更大

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const GEMINI_API_KEY   = process.env.GEMINI_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

// Upstash Redis (REST) —— 持久化浏览量计数
const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VIEW_KEY = "soultranslator:views";
const VIEW_BASE = Number(process.env.VIEW_BASE || 66); // 展示基数偏移：真实计数 2 + 66 = 起步 68

async function redis(...cmd) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) throw new Error("Upstash not configured");
  const r = await fetch(`${UPSTASH_URL}/${cmd.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await r.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

app.get("/", (req, res) => res.json({ status: "SoulTranslator backend OK" }));

// 浏览量：读取当前值
app.get("/api/views", async (req, res) => {
  try {
    const count = await redis("get", VIEW_KEY);
    res.json({ count: (Number(count) || 0) + VIEW_BASE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 浏览量：+1 并返回最新值（前端每个会话只调一次）
app.post("/api/views", async (req, res) => {
  try {
    const count = await redis("incr", VIEW_KEY);
    res.json({ count: (Number(count) || 0) + VIEW_BASE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 调试：列出当前 KEY 可用的 Gemini 模型
app.get("/api/models", async (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await r.json();
    const names = (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map(m => m.name);
    res.json({ usable: names, raw: data.error || undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 场景配置下发（D11-B）：前端拉这个动态渲染场景卡 + 关系滑块，加场景只改后端
app.get("/api/scenes", (req, res) => {
  res.json(getScenesPayload());
});

// DeepSeek 分析代理
app.post("/api/chat", async (req, res) => {
  if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: "DEEPSEEK_API_KEY not configured" });
  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + DEEPSEEK_API_KEY },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DeepSeek 分析（D11-B 大脑上移）：入参 { scene, level, text }，后端内置 prompt → DeepSeek → 结构化 JSON
// 与原前端 buildPrompt + /api/chat 调用严格等价（回归保证）；/api/chat 保留兼容、逐步弃用。
app.post("/api/analyze", async (req, res) => {
  if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: "DEEPSEEK_API_KEY not configured" });

  const { scene, role, text } = req.body || {};
  const level = Number(req.body && req.body.level);
  if (!scene || !(level >= 1 && level <= 4) || !text || !String(text).trim()) {
    return res.status(400).json({ error: "scene / level(1~4) / text required" });
  }
  // 学校场景需带合法 role（家长/学生/同事老师/校领导）
  if (scene === "school" && !SCHOOL_ROLES[role]) {
    return res.status(400).json({ error: "school scene requires valid role" });
  }

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + DEEPSEEK_API_KEY },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: buildSystemPrompt(scene, level, role) },
          { role: "user", content: `【对方说的话】：${text}` },
        ],
        temperature: 1.0,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const msg = data.error?.message || JSON.stringify(data).slice(0, 200);
      return res.status(response.status).json({ error: "DeepSeek API error: " + msg });
    }
    const raw = data.choices?.[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start < 0 || end < 0) return res.status(502).json({ error: "返回内容解析失败" });
    res.json(JSON.parse(clean.slice(start, end + 1)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gemini OCR：从截图提取对话文字
// 兼容两种入参：新版多图 { images: [{ imageData, mimeType }] }；旧版单图 { imageData, mimeType }
app.post("/api/ocr", async (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

  let images = Array.isArray(req.body.images) ? req.body.images : null;
  if (!images && req.body.imageData) images = [{ imageData: req.body.imageData, mimeType: req.body.mimeType }];
  images = (images || []).filter(im => im && im.imageData);
  if (!images.length) return res.status(400).json({ error: "imageData required" });

  // 单图保持原 prompt（不改网页行为）；多图当作同一段连续对话来读
  const single = "请仔细查看这张图片，它可能是聊天截图、手机屏幕照片、或截图的截图。请找出图中所有聊天气泡里的文字，按顺序提取对话内容，格式为「A：内容 / B：内容」。只输出对话文字，不要描述图片。如果完全没有任何聊天文字，只回复：NOT_CHAT";
  const multi = "下面这几张图是同一段聊天对话的连续截图（按给出的先后顺序）。请把它们当作一段完整对话：按时间顺序合并、去掉重叠重复的消息，提取所有聊天气泡里的文字，格式为「A：内容 / B：内容」（A=对方、B=我，按气泡左右/颜色判断，全程保持同一人对应同一标签）。只输出对话文字，不要描述图片。如果完全没有任何聊天文字，只回复：NOT_CHAT";
  const instruction = images.length > 1 ? multi : single;

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const parts = images.map(im => ({ inline_data: { mime_type: im.mimeType || "image/jpeg", data: im.imageData } }));
    parts.push({ text: instruction });
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0, maxOutputTokens: 1536 }
      }),
    });
    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      const msg = data.error?.message || JSON.stringify(data).slice(0,200);
      return res.status(500).json({ error: "Gemini API error: " + msg });
    }
    const text = data.candidates[0]?.content?.parts?.[0]?.text?.trim() || "";
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SoulTranslator backend running on port " + PORT));
