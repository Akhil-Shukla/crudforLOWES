const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});


<<<<<<< Updated upstream
app.get('/justanothergirl', (req, res) => {
  res.send('Hello another girl!')
=======
app.get('/thkiller', (req, res) => {
  res.send('Hello killer!')
>>>>>>> Stashed changes
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
