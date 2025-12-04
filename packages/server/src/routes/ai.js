import express from 'express';
import { verifyToken } from '../middleware/auth.js';
// In a real scenario, you'd use the official SDK: import OpenAI from 'openai';
// For this architecture, we will use a generic fetch or mock to demonstrate the flow without forcing a specific SDK dependency immediately.
import axios from 'axios'; 

const router = express.Router();

const SYSTEM_PROMPT = `
You are 'AlgoBot', the AI Code Coach for AlgoVerse, a competitive programming platform for college students.
Your Goal: Help the student solve the problem WITHOUT giving them the full solution code.
Rules:
1. If asked for a HINT, give a conceptual clue (e.g., "Consider using a HashMap to store visited elements").
2. If asked for TIME COMPLEXITY, analyze their code and explain the Big O notation.
3. If asked to DEBUG, find the syntax or logical error and explain WHY it's wrong, but let them fix it.
4. Keep responses concise, encouraging, and formatted with Markdown.
5. If the user is being lazy, gently push them to think.
`;

router.post('/chat', verifyToken, async (req, res) => {
    try {
        const { message, code, problemContext, contextType } = req.body;
        // contextType can be 'general', 'complexity', 'debug', 'hint'

        // Construct the prompt based on context
        let userPrompt = `Student Question: "${message}"\n\n`;
        
        if (code) {
            userPrompt += `Current Code:\n\`\`\`${code}\`\`\`\n\n`;
        }
        
        if (problemContext) {
            userPrompt += `Problem Title: ${problemContext.title}\nDescription: ${problemContext.description}\n\n`;
        }

        if (contextType === 'complexity') {
            userPrompt += "Please analyze the Time and Space complexity of the code provided.";
        } else if (contextType === 'debug') {
            userPrompt += "Please find potential bugs or syntax errors in the code.";
        }

        // --- CALL TO LLM (OpenAI/Groq compatible endpoint) ---
        // Ensure you have AI_API_KEY and AI_API_URL in your .env
        // Example URL for Groq: https://api.groq.com/openai/v1/chat/completions
        
        const response = await axios.post(
            process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
            {
                model: process.env.AI_MODEL || "gpt-3.5-turbo", // or "llama3-70b-8192" for Groq
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiReply = response.data.choices[0].message.content;

        res.json({ reply: aiReply });

    } catch (err) {
        console.error("AI Service Error:", err.response?.data || err.message);
        res.status(500).json({ message: "AI Coach is currently offline. Try again later." });
    }
});

export default router;