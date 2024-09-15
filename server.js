const fs = require('fs');
const path = require('path');

// Read the API key from key.txt
const keyPath = path.join(__dirname, 'key.txt');
const apikey = fs.readFileSync(keyPath, 'utf8').trim();

console.log(`Your API key is: ${apikey}`);


const express = require('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { Pool } = require('pg');

const pool = new Pool({
  user: 'gpt',
  host: 'localhost',
  database: 'gpt',
  password: 'test1234',
  port: 5432,
});

const corsOptions = {
  origin: 'http://192.168.1.191', // Replace with your frontend's domain
  optionsSuccessStatus: 200
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/send-text', async (req, res) => {
  console.log("received data");
  const { message, conversation, session, user } = req.body;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apikey,
    },
    body: JSON.stringify({
      'model': 'gpt-4o-mini',
      'messages': conversation,
      'temperature': 0.7,
    })
  });

  const data = await response.json();
  data.sesssionid = 1000;

  try {
    const query = "INSERT INTO chat_sessions (session_id, prompt, response) VALUES ($1, $2, $3) RETURNING id;";
    values = [1001,message,data.choices[0].message.content];
    const result = await pool.query(query, values);
    res.json({ content: data });
    await idk(result.rows[0].id);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error saving data');
  }
});

async function idk(chatid){
  console.log("summing data");
  console.log(chatid)
  //const { message, conversation } = req.body;
  conversation = [];
  conversation.push({ role: 'system', content: "you generate a comma seperated keyword list based on the input so that this data can be recalled in a sql query." });
  const query = "SELECT response FROM chat_sessions WHERE id = 53;";
  const result = await pool.query(query);
  console.log(result.rows[0]);
  conversation.push({role: 'user', content: result.rows[0].response});
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apikey,
    },
    body: JSON.stringify({
      'model': 'gpt-4o-mini',
      'messages': conversation,
      'temperature': 0.7,
    })
  });

  const data = await response.json();

  try {
    console.log(data);
    const query = "INSERT INTO topic (chat_session_id, topic) VALUES ($1, $2)";
    values = [53,data.choices[0].message.content];
    await pool.query(query, values);
    res.json({ content: data });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error saving data');
  }
};


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
