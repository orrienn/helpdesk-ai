const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');

let messages = [];
let formState = {};

function appendMessage(sender, text) {
  const p = document.createElement('p');
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateFormFields(state) {
  document.getElementById('name-field').textContent = state.name || '—';
  document.getElementById('lastName-field').textContent = state.lastName || '—';
  document.getElementById('email-field').textContent = state.email || '—';
  document.getElementById('reason-field').textContent = state.reason || '—';
  document.getElementById('urgency-field').textContent = state.urgency || '—';
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

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
    const fullReply = data.response;

    const replyMatch = fullReply.match(/REPLY:\s*(.*?)\n\nFORM_STATE:/s);
    const formStateMatch = fullReply.match(/FORM_STATE:\s*({[\s\S]*})/);

    let reply = replyMatch ? replyMatch[1].trim() : fullReply;

    appendMessage('Assistant', reply);
    
    messages.push({ role: 'model', parts: [{ text: reply }] });

    if (formStateMatch) {
      try {
        const parsed = JSON.parse(formStateMatch[1]);
        formState = { ...formState, ...parsed };
        updateFormFields(formState);
      } catch (err) {
        console.warn('Could not parse formState JSON');
      }
    } else {
      console.log('No formState found in reply');
    }
  } catch (err) {
    appendMessage('Error', 'Connection failed.');
    console.error(err);
  }
});