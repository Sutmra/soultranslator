const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const GEMINI_API_KEY   = process.env.GEMINI_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

// Upstash Redis (REST) —— 持久化浏览量计数
const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VIEW_KEY = "soultranslator:views";

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
    res.json({ count: Number(count) || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 浏览量：+1 并返回最新值（前端每个会话只调一次）
app.post("/api/views", async (req, res) => {
  try {
    const count = await redis("incr", VIEW_KEY);
    res.json({ count: Number(count) || 0 });
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

// Gemini OCR：从截图提取对话文字
app.post("/api/ocr", async (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  const { imageData, mimeType } = req.body;
  if (!imageData) return res.status(400).json({ error: "imageData required" });

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType || "image/jpeg", data: imageData } },
            { text: "请仔细查看这张图片，它可能是聊天截图、手机屏幕照片、或截图的截图。请找出图中所有聊天气泡里的文字，按顺序提取对话内容，格式为「A：内容 / B：内容」。只输出对话文字，不要描述图片。如果完全没有任何聊天文字，只回复：NOT_CHAT" }
          ]
        }],
        generationConfig: { temperature: 0, maxOutputTokens: 512 }
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
