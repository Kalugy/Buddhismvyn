import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";

config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages, system, apiKey } = req.body;

  // Use the key sent from the client, fall back to server .env key
  const key = apiKey || process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return res.status(400).json({ error: "No API key provided. Please enter your Anthropic API key in the chat settings." });
  }

  if (!key.startsWith("sk-ant-")) {
    return res.status(400).json({ error: "Invalid API key format. Anthropic keys start with sk-ant-" });
  }

  try {
    const client = new Anthropic({ apiKey: key });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages,
    });

    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error(err);
    // Surface auth errors clearly to the client
    if (err.status === 401 || err.message?.includes("auth")) {
      return res.status(401).json({ error: "Invalid API key — authentication failed. Please check your key and try again." });
    }
    res.status(500).json({ error: err.message || "Failed to get response from Claude" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
