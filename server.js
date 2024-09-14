const express = require('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const apikey = ''

const corsOptions = {
  origin: 'http:/192.168.1.191', // Replace with your frontend's domain
  optionsSuccessStatus: 200
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/send-text', async (req, res) => {
  console.log("received data");
  const { message, conversation } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + "abc1234",
    },
    body: JSON.stringify({
      'model': 'gpt-4',
      'messages': conversation,
      'temperature': 0.7,
    }),
  });

  const data = await response.json();
  res.json({ content: data.choices[0].message.content });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
