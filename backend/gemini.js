import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function chatWithGemini(messages, formState = {}) {
  const systemPrompt = `
    You are a helpful assistant that helps users fill out a helpdesk form.

    Ask only one question at a time to collect the following:
    - name (max 20 characters)
    - last name (max 20 characters)
    - email (must be valid)
    - reason of contact (max 100 characters)
    - urgency (number 1-10)

    After each user response, analyze if you can extract any of the above fields. 
    Always return your message to the user AND the current formState object in JSON format.

    Respond in the following format:

    REPLY: <your message to the user>

    FORM_STATE:
    {
      "name": "",
      "lastName": "",
      "email": "",
      "reason": "",
      "urgency": null
    }

    Current form state:
    ${JSON.stringify(formState, null, 2)}
  `;

  const fullMessages = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...messages,
  ];

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const response = await axios.post(
    url,
    { contents: fullMessages },
    { headers: { 'Content-Type': 'application/json' } }
  );

  return response.data.candidates[0].content.parts[0].text;
}