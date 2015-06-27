define(function(require) {
  var io = require('vendor/socket-io');

  var AppSocketActions = require('app/actions/AppSocketActions');

  var socket = io('http://localhost:3000');

  var Events = {
    AWAITING_POSITION: 'awaiting-position',
    POSITION_RECIEVED: 'position-received'
  };

  socket.on('connect', function() {
    console.debug('Connection established.');
  });

  socket.on('disconnect', function() {
    console.debug('Disconnecting.');
  });

  socket.on(Events.POSITION_RECIEVED, function(){
    AppSocketActions.startPlaying();
    console.debug('Started playing.');
  });

  var Connection = {
    notifyAwaitPosition: function() {
      socket.emit(Events.AWAITING_POSITION);
      console.debug('Awaiting position emitted.');
    }
  };

  return Connection;
});
