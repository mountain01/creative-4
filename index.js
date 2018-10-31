const express = require('express')
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
console.log(port);

app.use(express.static(__dirname + '/public'));

app.use('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' })
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
