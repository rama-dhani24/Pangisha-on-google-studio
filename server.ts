import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API routes go here high up, before Vite middlewares
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Pangisha API" });
});

// 1. Swahili-English AI Rental Advisor Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentListings } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `
You are \"Pangisha Advisor,\" the friendliest and smartest AI rental advisor for Tanzanian living rooms, studios, and rental spaces.
You reside in Dar es Salaam but are highly knowledgeable about Arusha, Zanzibar, Dodoma, Mwanza, Kilimanjaro, and other Tanzanian regions.

Guidelines:
1. Adopt a welcoming, polite, and authoritative Tone. Match the Swahili \"Mkaribishaji\" (welcoming host) vibe, expressing warmth and readiness to help (e.g., \"Karibu sana!\", \"Habari ya leo?\").
2. Answer comfortably in Swahili, English, or mixed Swahili-English (\"Sheng\" / bilingual style) based on the user's preference.
3. Below is the list of currently active real-time rental listings from the database. Refer to these listings specifically when a user is filtering or searching:
${JSON.stringify(currentListings || [], null, 2)}
4. If a listing is relevant, mention its key details: Monthly Price (in Tanzanian Shilling, TSh or TZS), Region/Neighborhood, host contacts, and why it fits. Let the user know they can click on it in the main grid!
5. If no listing fits, offer helpful local advice on where they might look (e.g., Sinza, Masaki, Kariakoo, Njiro, or Zanzibar Stone Town), typical pricing guidelines in Tanzania, or typical amenities.
6. Keep recommendations concrete, useful, and avoid repeating the exact raw JSON. Summarize features like Wi-Fi, AC, and Backup Generator (\"Jenereta ya dharura\"), which are highly treasured in Dar!
    `;

    // Map frontend messages into the format required by GoogleGenAI chat or generateContent
    // Since we are using standard content generation, let's reconstruct the conversation story
    const convoContents = messages.map((m: any) => {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: convoContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Poleni, kulikuwa na hitilafu. Tafadhali jaribu tena.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Advisor Error:", error);
    res.status(500).json({
      error: "Imeshindikana kuwasiliana na Gemini. Please check your Gemini API key in Secrets.",
      details: error.message,
    });
  }
});

// 2. AI SWahili-English Title & Description Optimizer (Polisher)
app.post("/api/generate-description", async (req, res) => {
  try {
    const { title, region, price, amenities, details } = req.body;

    const prompt = `
Generate an outstanding, cozy, and highly professional property listing description for a rental living space in Tanzania.
Context:
- Title: ${title}
- Region/City: ${region}
- Price: ${price} TZS per month
- Amenities: ${Array.isArray(amenities) ? amenities.join(", ") : amenities}
- Extra manual inputs: ${details || "None provided"}

Requirements:
- Create a beautiful, engaging rental description formatted with headers and bullet points.
- Provide it as a bilingual structure (First a vibrant Swahili pitch, followed by a professional English translation).
- Highlight local convenience, safety, and why it is an ideal "living room" or home. Include Swahili marketing triggers like \"Inavutia sana\", \"Mazingira tulivu\", \"Ulinzi wa kutosha\".
- Return the generated content dynamically. Provide an optimized catchy Title for the listing as well.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Tanzanian real estate copywriter. Write descriptive, warm, and highly persuasive listings.",
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Polisher Error:", error);
    res.status(500).json({
      error: "Failed to generate AI description. Make sure GEMINI_API_KEY is configured.",
      details: error.message,
    });
  }
});

// 3. AI Local Market Price Advisor
app.post("/api/market-insights", async (req, res) => {
  try {
    const { region } = req.body;

    const prompt = `
Give a quick, concise profile of the rental market in the region: "${region}" in Tanzania.
Include:
1. Typical price ranges for standard studio rooms up to luxurious apartments in TZS.
2. The most popular or upscale neighborhoods there (for instance description of Masaki/Oysterbay vs Makerere / Sinza in Dar, or Njiro vs Sekei in Arusha).
3. The common amenities required for that region (e.g., backup water tanks, security walls, air conditioning for coastal vs mosquito guard screens, heaters for Arusha).
4. Swahili-English tone, short and scannable bullet points.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a savvy Tanzanian property analyst. Be professional, direct, and give helpful local real estate advice.",
        temperature: 0.5,
      },
    });

    res.json({ insights: response.text });
  } catch (error: any) {
    console.error("Gemini Insights Error:", error);
    res.status(500).json({
      error: "Failed to fetch market insights.",
      details: error.message,
    });
  }
});

// Integration of Vite Dev Middleware or Client Production Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pangisha Server successfully running on http://localhost:${PORT}`);
  });
}

startServer();
