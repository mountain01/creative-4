let messageContainer = document.querySelector('.messages');

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
const app = angular.module('app', []);

app.controller('MainCtrl', function(socket) {
  const ctrl = this;
  ctrl.title = 'Creative 4';
  ctrl.loggedIn = false;
  ctrl.users = [];
  ctrl.messages = [];
  ctrl.message = '';
  ctrl.login = function(name) {
    socket.emit('login', name, (valid, users) => {
      ctrl.inUse = !valid;
      ctrl.loggedIn = valid;
      ctrl.name = name;
      ctrl.users = users
    });
  };
  socket.on('login', (data) => {
    ctrl.users = data.allUsers;
    ctrl.messages.push(`${data.user} just logged in`)
  });
  socket.on('logout', (data) => {
    ctrl.users = data.allUsers;
    ctrl.messages.push(`${data.user} just logged out`)
  });

  socket.on('message', (data) => {
    messageContainer = document.querySelector('.messages');
    const shouldScroll = messageContainer.scrollTop + messageContainer.clientHeight === messageContainer.scrollHeight;
    ctrl.messages.push(data.user + ': ' + data.message);
    !shouldScroll && scrollToBottom();
  })

  socket.on('disconnect', () => console.log('you logged out'));

  socket.on('reconnect', () => {
    if (ctrl.name) {
      ctrl.login(ctrl.name);
    }
  })

  ctrl.submitMessage = function(message) {
    socket.emit('message', message);
    ctrl.message = '';
  }


});

app.factory('socket', function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

scrollToBottom();
