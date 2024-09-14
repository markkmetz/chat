const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/send-text', (req, res) => {
  const text = req.body.text;

  console.log(`Text received: ${text}`);
  res.send(`Text received: ${text}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
