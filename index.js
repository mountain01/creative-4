const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
console.log(port);

app.use(express.static(__dirname + '/public'));

app.use('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
