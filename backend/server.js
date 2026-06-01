const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

app.get("/", (req, res) => res.json({ status: "SoulTranslator backend OK" }));

app.post("/api/chat", async (req, res) => {
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: "DEEPSEEK_API_KEY not configured" });
  }
  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + DEEPSEEK_API_KEY,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SoulTranslator backend running on port " + PORT));
