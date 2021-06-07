const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.get('/stashtest', (req, res) => {
  res.send('Hello World!')
});
app.get('/testingfor stash', (req, res) => {
  res.send('Hello testing for stash!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
