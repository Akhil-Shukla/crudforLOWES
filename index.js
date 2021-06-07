const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/fellow', (req, res) => {
  res.send('Hello fellow!')
});

<<<<<<< HEAD
app.get('/madagascar', (req, res) => {
  res.send('madagascar!')
});


=======
app.get('/thisissparta', (req, res) => {
  res.send('Hello fellow!')
});



>>>>>>> 010d6e62c6a2f76c4b92cbd634ff8d4c263b6cfc
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
