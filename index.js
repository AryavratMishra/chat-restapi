import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

// ---- ROOT ROUTE (REQUIRED for uptime ping) ----
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ---- ASK ROUTE ----
app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received";

    res.json({ reply: aiText });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

// ---- FIXED START SERVER FOR RENDER ----
const PORT = process.env.PORT || 5000;  // Render requires this
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
