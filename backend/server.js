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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType || "image/jpeg", data: imageData } },
            { text: "这是一张聊天截图。请只提取其中的对话文字内容，按时间顺序输出，格式为「发送方：内容」。如果图片里没有聊天对话，只回复：NOT_CHAT" }
          ]
        }],
        generationConfig: { temperature: 0, maxOutputTokens: 512 }
      }),
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SoulTranslator backend running on port " + PORT));
