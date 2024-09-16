const form = document.getElementById('input-form');
const messageInput = document.getElementById('input-message');
const chat = document.getElementById('chat');

function postMessage() {
  const message = messageInput.value;
  if (message.length > 0) {
    appendMessage2('user', message);
    //chat.innerHTML += `<span class="user">User: ${message}</span><br/>`;
    messageInput.value = "";
    callOpenAI(message);
  }
}

function appendMessage(role, content) {
  var paragraph = document.createElement('p');
  paragraph.classList.add(role);
  paragraph.textContent = role + ": " + content;
  document.getElementById('chat').append(paragraph);
}

function appendMessage2(role, content) {
  var card = document.createElement('div');
  card.classList.add('card', 'mb-3');

  if (role === 'user') {
    card.classList.add('border-primary');
    card.style.marginLeft = '1%';
    card.style.marginRight = '10%';
  } else if (role === 'assistant') {
    card.classList.add('border-secondary');
    card.style.marginLeft = '10%';
    card.style.marginRight = '1%';
  }

  var cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  if (role === 'assistant') {
    cardHeader.classList.add('text-end');
  }

  var avatar = document.createElement('img');
  avatar.src = role === 'user' ? 'avatar1.jpg' : 'avatar2.bmp';
  avatar.alt = 'Avatar';
  avatar.classList.add('avatar');

  var headerText = document.createElement('h5');
  headerText.textContent = role === 'user' ? 'User' : 'GPT';

  cardHeader.appendChild(avatar);
  cardHeader.appendChild(headerText);

  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  var cardText = document.createElement('p');
  cardText.classList.add('card-text');
  cardText.textContent = content;

  cardBody.appendChild(cardText);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  const chatcontainer = document.getElementById('chat');
  chatcontainer.append(card);
  chatcontainer.scrollTop = chatcontainer.scrollHeight;

  requestAnimationFrame(() => {
    chatcontainer.scrollTop = chatcontainer.scrollHeight;
  });

}

document.getElementById('input-message').addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    postMessage();
  }
});

document.getElementById('loginButton').addEventListener('click', async () => {
  const response = await fetch('https://proxy.kmetzenterprises.com:3000/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: document.getElementById('useremail').value,
          password: document.getElementById('userpassword').value
      })
  });

  if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
  } else {
      console.error('Login failed');
  }
});


form.addEventListener('submit', function (e) {
  e.preventDefault();
  postMessage();
});

function loadlastsession() {
  console.log("hello!");
}

let conversation = [];
conversation.push({ role: 'system', content: "you are a helpful ai assistant. responses are thoughtful, but usually short and summarized like human speech." })
let sessionid = null;
let userid = 1000;

async function callOpenAI(message) {
  conversation.push({ role: 'user', content: message });
  const response = await fetch('https://proxy.kmetzenterprises.com:3000/api/send-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, conversation, sessionid, userid }),
  });

  const data = await response.json();
  const botMessage = data.content.choices[0].message.content;
  sessionid = data.content.sessionid;
  conversation.push({ role: 'assistant', content: botMessage });
  appendMessage2('assistant', botMessage);
}

