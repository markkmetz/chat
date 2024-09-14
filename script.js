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
  paragraph.textContent = role + ": " + content;
  document.getElementById('chat').append(paragraph);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  postMessage();
});

let conversation = [];

async function callOpenAI(message){
  conversation.push({role: 'user', content: message});
  const response = await fetch('http://192.168.1.1:3000/api/send-text', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, conversation }),
    });
  
    const data = await response.json();
    conversation.push({ role: 'assistant', content: data.content });
  }

//   const content = await response.json();
//   const botMessage = content.choices[0].message.content;
//   conversation.push({role: 'assistant', content: botMessage});
//   appendMessage('Assistant', botMessage);
// }