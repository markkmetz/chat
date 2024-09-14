const form = document.getElementById('input-form');
const messageInput = document.getElementById('input-message');
const chat = document.getElementById('chat');

function postMessage() {
  const message = messageInput.value;
  chat.innerHTML += `<span class="user">User: ${message}</span><br/>`;
  messageInput.value = "";
  callOpenAI(message);
}

function appendMessage(role, content) {
  var paragraph = document.createElement('p');
  paragraph.classList.add(role);
  paragraph.textContent = role + ": " + content;
  document.getElementById('chat').append(paragraph);
}

document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();
    console.log("wtf");
});

let conversation = [];

async function callOpenAI(message){
  conversation.push({role: 'user', content: message});
  const response = await fetch('http://192.168.1.191:3000/api/send-text', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, conversation }),
    });
  
    const data = await response.json();
    conversation.push({ role: 'assistant', content: data.content });
  }

