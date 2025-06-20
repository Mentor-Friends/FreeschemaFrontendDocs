const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatIcon = document.getElementById('chat-icon');
const appContainer = document.querySelector('.app-container');
const STORAGE_KEY = 'freeSchema_chat_history';
const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

function renderHistory() {
    chatBody.innerHTML = '';
    history.forEach(msg => appendMessage(msg.text, msg.sender, false));
    scrollToBottom();
}

function appendMessage(text, sender, persist = true) {
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'assistant-message');
    div.textContent = text;
    chatBody.appendChild(div);
    setTimeout(scrollToBottom, 10);

    if (persist) {
    history.push({ sender, text });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
}


async function sendQuery(text) {
    // Get the last 3 turns (user+bot = 2 messages per turn → last 6 messages)
    const lastTurns = history.slice(-6); // Adjust if structure changes

    const context = {};
    for (let i = 0; i < lastTurns.length; i += 2) {
        if (lastTurns[i] && lastTurns[i + 1]) {
            context["user"] = lastTurns[i].text;
            context["bot"] = lastTurns[i + 1].text;
        }
    }

    const url = `https://devai.freeschema.com/api/rag/query?question=${encodeURIComponent(text)}&organization_id=freeschema&context=${encodeURIComponent(JSON.stringify(context))}`;
    // const url = `https://devai.freeschema.com/api/rag/query?question=${encodeURIComponent(text)}&organization_id=freeschema`;
    const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '',
    });
    if (!resp.ok) {
    throw new Error(`Server error: ${resp.status}`);
    }
    const { answer } = await resp.json();
    return answer;
}

sendButton.addEventListener('click', async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatInput.value = '';
    appendMessage('Thinking...', 'assistant', false);

    const botAnswer = await sendQuery(text);
    const last = chatBody.lastChild;
    if (last.classList.contains('assistant-message')) {
    last.textContent = botAnswer;
    } else {
    appendMessage(botAnswer, 'assistant');
    }

    history.push({ sender: 'assistant', text: botAnswer });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
    e.preventDefault();
    sendButton.click();
    }
});

chatIcon.addEventListener('click', () => {
    appContainer.style.display = appContainer.style.display === 'none' ? 'block' : 'none';
});

renderHistory();