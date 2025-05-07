const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');

let messages = [];
let formState = {};

chatForm.addEventListener('submit', sendMessage);

function appendMessage(sender, text) {
  const p = document.createElement('p');
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(event) {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  appendMessage('You', text);
  messages.push({ role: 'user', parts: [{ text }] });
  userInput.value = '';

  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, formState }),
    });

    const data = await res.json();
    const reply = data.response;

    if (data.formState) {
      formState = data.formState;
    }

    messages.push({ role: 'model', parts: [{ text: reply }] });
    appendMessage('Bot', reply);
  } catch (err) {
    appendMessage('Error', 'Connection failed.');
    console.error(err);
  }
}