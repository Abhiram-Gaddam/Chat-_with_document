 const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

const API_KEY = "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"; // Replace with your actual API key

// Multer setup for handling PDF uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Endpoint to Extract Text from PDF
app.post("/extract-text", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const pdfBuffer = req.file.buffer;
        const data = await pdfParse(pdfBuffer);
        const extractedText = data.text.trim(); // Get cleaned text

        res.json({ text: extractedText }); // Send extracted text to frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Endpoint to Process Extracted Text with OpenRouter AI
app.post("/process-text", async (req, res) => {
    const { context, question } = req.body;

    if (!context || !question) {
        return res.status(400).json({ error: "Context and question are required." });
    }

    const inputPrompt = `Based on the following text, answer the question:\n\nText: ${context}\n\nQuestion: ${question}\nAnswer:`;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemma-3-4b-it:free",
                messages: [{ role: "user", content: inputPrompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "HTTP-Referer": "https://yourwebsite.com", // Replace with actual site URL
                    "X-Title": "YourWebsiteName", // Replace with actual site name
                },
            }
        );

        if (response.data.choices && response.data.choices.length > 0) {
            return res.json({ answer: response.data.choices[0].message.content });
        } else {
            return res.status(500).json({ error: "No response received from AI API." });
        }
    } catch (error) {
        console.error("Request failed:", error.message);
        return res.status(500).json({ error: "AI API request failed." });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











