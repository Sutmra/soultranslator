const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const GEMINI_API_KEY   = process.env.GEMINI_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

app.get("/", (req, res) => res.json({ status: "SoulTranslator backend OK" }));

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
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
