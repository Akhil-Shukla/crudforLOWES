const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/justanothergirl', (req, res) => {
  res.send('Hello another girl!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
