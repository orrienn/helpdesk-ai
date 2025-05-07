import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function chatWithGemini(messages, formState = {}) {
    const systemPrompt = `
You are a helpful assistant tasked with aiding people in filling out a helpdesk form. Ask questions to gather the following information:

- Firstname (max 20 characters)
- Lastname (max 20 characters)
- Email (must be valid format)
- Reason of contact (max 100 characters)
- Urgency (integer from 1 to 10)

Don't ask about things that are already filled in. If all fields are filled, confirm the submission and ask if the user wants to make any changes.

Current form state:
${JSON.stringify(formState, null, 2)}
    `.trim();

    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

    const fullMessages = [
        {
            role: 'user',
            parts: [{ text: systemPrompt }],
        },
        ...messages
    ];

    try {
        const response = await axios.post(
            url,
            { contents: fullMessages },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error communicating with Gemini:', error.response?.data || error.message);
        throw error;
    }
}
