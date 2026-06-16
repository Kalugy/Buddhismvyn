import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
import https from "https";
import http from "http";

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

// Image proxy — follows redirects server-side to serve Wikipedia/Wikimedia images
function fetchWithRedirects(url, res, depth = 0) {
  if (depth > 8) return res.status(508).send("Too many redirects");
  const parsed = new URL(url);
  const protocol = parsed.protocol === "https:" ? https : http;

  const opts = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      "Referer": "https://en.wikipedia.org/",
    },
  };

  protocol.get(opts, (proxyRes) => {
    const { statusCode, headers } = proxyRes;
    if ([301, 302, 303, 307, 308].includes(statusCode) && headers.location) {
      proxyRes.resume(); // drain the body
      const next = headers.location.startsWith("http")
        ? headers.location
        : `${parsed.protocol}//${parsed.host}${headers.location}`;
      return fetchWithRedirects(next, res, depth + 1);
    }
    const ct = headers["content-type"] || "";
    if (!ct.startsWith("image/")) {
      proxyRes.resume();
      return res.status(502).send("Remote URL did not return an image (got: " + ct + ")");
    }
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400");
    proxyRes.pipe(res);
  }).on("error", (e) => res.status(502).send("Proxy error: " + e.message));
}

// Resolve a Wikipedia filename → actual image binary URL via Wikimedia API, then proxy it
app.get("/api/img", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url param");

  // If it looks like a Special:Redirect URL, extract the filename and use the API
  const redirectMatch = url.match(/Special:Redirect\/file\/(.+)$/);
  if (redirectMatch) {
    const filename = decodeURIComponent(redirectMatch[1]);
    try {
      // Wikimedia API: get actual image URL for this filename
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
      const apiRes = await fetch(apiUrl, { headers: { "User-Agent": "DharmaPathApp/1.0" } });
      const data = await apiRes.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages)[0];
      const imageUrl = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
      if (!imageUrl) return res.status(404).send("Image not found in Wikimedia API");
      return fetchWithRedirects(imageUrl, res);
    } catch (e) {
      return res.status(502).send("Wikimedia API error: " + e.message);
    }
  }

  // Regular URL — proxy directly
  try { new URL(url); } catch { return res.status(400).send("Invalid url"); }
  fetchWithRedirects(url, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
