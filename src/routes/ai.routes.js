const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔹 Define the GPT4All local API URL
const GPT4ALL_API_URL = "http://localhost:4891/v1/chat/completions";

// 🔹 Ask AI Endpoint
router.post("/ask", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        // 🔹 Send request to GPT4All
        const response = await axios.post(GPT4ALL_API_URL, {
            model: "gpt4all", // Default model name for GPT4All API
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200, // Adjust token limit as needed
            temperature: 0.7
        });

        return res.json({ response: response.data });
    } catch (error) {
        console.error("GPT4All Error:", error.message);
        return res.status(500).json({ message: "Failed to connect to GPT4All", error: error.message });
    }
});

module.exports = router;
