const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/fellow', (req, res) => {
  res.send('Hello fellow!')
});

app.get('/madagascar', (req, res) => {
  res.send('madagascar!')
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
