import express from 'express';
import dotenv from 'dotenv';
import { chatWithGemini } from './gemini.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message, formState } = req.body;

    if(!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await chatWithGemini(message, formState);
        res.json({ response });
    } catch (error) {
        console.error('Error communicating with Gemini:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});