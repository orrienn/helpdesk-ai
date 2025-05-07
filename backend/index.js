import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { chatWithGemini } from './gemini.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { messages, formState } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
    }

    try {
        const response = await chatWithGemini(messages, formState);
        res.json({ response, formState });
    } catch (error) {
        console.error('Error communicating with model:', error?.response?.data || error.message || error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});