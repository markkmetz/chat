const form = document.getElementById('input-form');
const messageInput = document.getElementById('input-message');
const chat = document.getElementById('chat');

document.getElementById('input-message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        postMessage();
    }
});

function postMessage() {
  const message = messageInput.value;
  chat.innerHTML += `<span class="user">User: ${message}</span><br/>`;
  messageInput.value = "";
  callOpenAI(message);
}


function appendMessage(role, content) {
  var paragraph = document.createElement('p');
  paragraph.classList.add(role);
  paragraph.textContent = role.toUpperCase() + ": " + content;
  document.getElementById('chat').append(paragraph);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  postMessage();
});

let conversation = [];

async function callOpenAI(message){
  conversation.push({role: 'user', content: message});
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + "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",
    },
    body: JSON.stringify({
      'model': 'gpt-3.5-turbo',
      'messages': conversation,
      'temperature': 0.7,
    }),
  });

  const content = await response.json();
  const botMessage = content.choices[0].message.content;
  conversation.push({role: 'assistant', content: botMessage});
  appendMessage('assistant', botMessage);
}
