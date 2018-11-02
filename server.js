const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
console.log(port);

let users = [];

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));

app.use('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

io.on('connection', function(socket) {
  console.log(`${socket.id} connected`);
  socket.on('login', (name, cb) => {
    if (users.indexOf(name) !== -1) {
      cb(false);
      return;
    }
    else {
      socket.username = name;
      users.push(name);
      console.log(`${name} has logged in`);
      socket.broadcast.emit('login', { allUsers: users, user: name });
      cb(true, users);
    }
  });
  socket.on('message', function(msg) {
    io.emit('message', { user: socket.username, message: msg });
    console.log('message: ' + msg);
  });
  socket.on('disconnect', () => logout(socket));
  socket.on('logout', () => logout(socket));
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

function logout({ username }) {
  console.log(`${username} logged out`);
  users = users.filter(a => a !== username);
  io.emit('logout', { allUsers: users, user: username });
}
