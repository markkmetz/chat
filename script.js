
const form = document.getElementById('input-form');
const messageInput = document.getElementById('input-message');
const chat = document.getElementById('chat');



form.addEventListener('submit', function(e) {
  e.preventDefault()
  const message = messageInput.value;
  // Append user's message to chat
  chat.innerHTML += `<p>User: ${message}</p>`;
  messageInput.value = "";
  callOpenAI(message);
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
          body: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': conversation, 'temperature': 0.7 }), 
      });
      
      const content = await response.json(); 
      const botMessage = content.choices[0].message.content;
      conversation.push({role: 'assistant', content: botMessage});
  
      chat.innerHTML += `<p>Bot: ${botMessage}</p>`; 
  }
  