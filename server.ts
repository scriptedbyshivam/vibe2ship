import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./server/routes/auth.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Connect to MongoDB if MONGODB_URI is provided
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB successfully."))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("WARNING: MONGODB_URI is not defined. Authentication will fail unless you provide it in Settings > Secrets.");
}

// Increase payload limit to support base64 images
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.use("/api/auth", authRoutes);

// Initialize Gemini Client safely
// Set the User-Agent to 'aistudio-build' for telemetry
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment variables.");
}

// REST API endpoint for analyzing citizen inputs
app.post("/api/analyze", async (req, res): Promise<any> => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API client is not initialized. Please ensure GEMINI_API_KEY is set in Settings > Secrets.",
      });
    }

    const { text, voiceTranscript, image } = req.body;

    if (!text && !voiceTranscript && !image) {
      return res.status(400).json({
        error: "At least one input (text, voice transcript, or image) must be provided.",
      });
    }

    // Build the parts array for multimodal input
    const parts: any[] = [];

    // Add prompt instructions
    let promptText = `Analyze the provided citizen input to detect and convert it into a structured municipal civic issue report.

You are "CivicMind Understanding Agent", a senior multimodal AI system built for municipal issue detection.
Your analysis must be precise, objective, and evidence-based.

CRITICAL RULES:
1. Do NOT guess or extrapolate without concrete evidence from the input (image, text, or voice transcript).
2. If uncertain about specific details or if the evidence is weak, lower your "confidence" score significantly (e.g. to 0.1 - 0.5).
3. Under no circumstances should you invent a location hint if none is provided in the input.
4. Prefer matching the exact permitted CIVIC CATEGORIES.

Permitted CIVIC CATEGORIES (issue_type):
- pothole
- water_leak
- street_light_failure
- garbage_dump
- road_damage
- tree_fall
- drainage_issue
- other

Let's evaluate the inputs:`;

    if (text) {
      promptText += `\n- Citizen's Text Description: "${text}"`;
    }
    if (voiceTranscript) {
      promptText += `\n- Voice Transcript: "${voiceTranscript}"`;
    }
    if (image) {
      promptText += `\n- An image has been uploaded by the citizen. Carefully inspect this image for visual evidence of the reported civic issue. Check if it matches the text/voice description. If the image is unrelated, contradictory, or lacks clear evidence, reduce your confidence score.`;
    }

    parts.push({ text: promptText });

    // Extract image if available
    if (image) {
      try {
        let base64Data = "";
        let mimeType = "image/jpeg";
        let isSvg = false;

        if (image.startsWith("data:image/svg+xml") || image.includes("<svg")) {
          isSvg = true;
        }

        if (isSvg) {
          console.log("Mock vector SVG detected. Skipping image part for Gemini API call (Gemini does not support SVG MIME types natively).");
        } else {
          if (image.includes(",")) {
            const splitParts = image.split(",");
            const match = splitParts[0].match(/data:(.*?);base64/);
            if (match) {
              mimeType = match[1];
            }
            base64Data = splitParts[1];
          } else {
            base64Data = image;
          }

          parts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          });
        }
      } catch (err: any) {
        console.error("Error processing base64 image: ", err);
        return res.status(400).json({ error: "Invalid image format provided." });
      }
    }

    let response;
    try {
      console.log("Calling Gemini API with primary model: gemini-2.5-flash...");
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
          systemInstruction: "You are CivicMind Understanding Agent, a senior multimodal AI system built for municipal issue detection. You must strictly output JSON matching the requested schema. Be highly precise. If any detail is not supported by evidence in the inputs, leave it blank or lower the confidence.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "issue_type",
              "title",
              "description",
              "location_hint",
              "severity",
              "confidence",
              "tags",
            ],
            properties: {
              issue_type: {
                type: Type.STRING,
                description: "Must be exactly one of: pothole, water_leak, street_light_failure, garbage_dump, road_damage, tree_fall, drainage_issue, other",
              },
              title: {
                type: Type.STRING,
                description: "A professional, concise title for the detected issue (5-10 words max).",
              },
              description: {
                type: Type.STRING,
                description: "A detailed but direct description summarizing what was reported/observed. Maximum 2-3 sentences.",
              },
              location_hint: {
                type: Type.STRING,
                description: "Specific streets, neighborhoods, coordinates, or landmarks mentioned in text or voice. Leave empty string if absolutely no location info is provided.",
              },
              severity: {
                type: Type.STRING,
                description: "Estimated hazard severity. Must be exactly: low, medium, or high",
              },
              confidence: {
                type: Type.NUMBER,
                description: "Overall confidence score between 0.0 and 1.0. Lower it if text and image are mismatching, if the evidence is blurry/unclear, or if you had to rely on a fallback.",
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-4 keywords or administrative tags (e.g. 'public safety', 'waterworks', 'roads').",
              },
            },
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn("Primary model gemini-2.5-flash failed or was unavailable, attempting fallback model gemini-3.5-flash... Error:", primaryErr.message || primaryErr);
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          systemInstruction: "You are CivicMind Understanding Agent, a senior multimodal AI system built for municipal issue detection. You must strictly output JSON matching the requested schema. Be highly precise. If any detail is not supported by evidence in the inputs, leave it blank or lower the confidence.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "issue_type",
              "title",
              "description",
              "location_hint",
              "severity",
              "confidence",
              "tags",
            ],
            properties: {
              issue_type: {
                type: Type.STRING,
                description: "Must be exactly one of: pothole, water_leak, street_light_failure, garbage_dump, road_damage, tree_fall, drainage_issue, other",
              },
              title: {
                type: Type.STRING,
                description: "A professional, concise title for the detected issue (5-10 words max).",
              },
              description: {
                type: Type.STRING,
                description: "A detailed but direct description summarizing what was reported/observed. Maximum 2-3 sentences.",
              },
              location_hint: {
                type: Type.STRING,
                description: "Specific streets, neighborhoods, coordinates, or landmarks mentioned in text or voice. Leave empty string if absolutely no location info is provided.",
              },
              severity: {
                type: Type.STRING,
                description: "Estimated hazard severity. Must be exactly: low, medium, or high",
              },
              confidence: {
                type: Type.NUMBER,
                description: "Overall confidence score between 0.0 and 1.0. Lower it if text and image are mismatching, if the evidence is blurry/unclear, or if you had to rely on a fallback.",
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-4 keywords or administrative tags (e.g. 'public safety', 'waterworks', 'roads').",
              },
            },
          },
        },
      });
    }

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response returned from Gemini API.");
    }

    console.log("Raw Gemini Response received:", outputText);
    const report = JSON.parse(outputText.trim());

    // Double check issue_type constraint
    const validCategories = [
      "pothole",
      "water_leak",
      "street_light_failure",
      "garbage_dump",
      "road_damage",
      "tree_fall",
      "drainage_issue",
      "other",
    ];
    if (!validCategories.includes(report.issue_type)) {
      report.issue_type = "other";
    }

    // Force confidence in bounds
    if (typeof report.confidence !== "number" || isNaN(report.confidence)) {
      report.confidence = 0.5;
    } else {
      report.confidence = Math.max(0, Math.min(1, report.confidence));
    }

    // Force severity
    if (!["low", "medium", "high"].includes(report.severity)) {
      report.severity = "medium";
    }

    return res.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Analysis failed:", error);
    return res.status(500).json({
      error: "Municipal analysis failed. Check the server logs for more details.",
      details: error.message || error,
    });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    geminiInitialized: !!ai,
    time: new Date().toISOString(),
  });
});

// Vite middleware configuration for serving the SPA correctly
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicMind custom full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
