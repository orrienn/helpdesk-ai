import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function chatWithGemini(message, formState = {}) {
    const systemPrompt = `
        You are a helpful assistant tasked with aiding people in filling out a helpdesk form. Ask questionsto gather the following information:
        - Name (max 20 characters)
        - Last Name (max 20 characters)
        - Email (validate format)
        - Reason of contact (max 100 characters)
        - Urgency (integer, 1-10)
        
        Current form state (JSON):
        ${JSON.stringify(formState, null, 2)}
    `;

    const payload = {
        contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUżytkownik: ${message}`
                }
              ]
            }
        ]          
    };

    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

    const response = await axios.post(url, payload, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer';
    return text;
}