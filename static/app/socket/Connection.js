define(function(require) {
  var io = require('vendor/socket-io');

  var AppSocketActions = require('app/actions/AppSocketActions');

  var socket = io();

  var Events = {
    AWAITING_POSITION: 'awaiting-position',
    POSITION_RECIEVED: 'position-received',
    INCREASE_VOLUME: 'increase-volume',
    DECREASE_VOLUME: 'decrease-volume',
    INCREASE_TEMPO: 'increase-tempo',
    DECREASE_TEMPO: 'decrease-tempo',
    CURRENT_DEVICE: 'current-device'
  };

  socket.on('connect', function() {
    console.debug('Connection established.');
  });

  socket.on('disconnect', function() {
    console.debug('Disconnecting.');
  });

  socket.on(Events.POSITION_RECIEVED, function() {
    AppSocketActions.startPlaying();
    console.debug('Started playing.');
  });

  socket.on(Events.INCREASE_VOLUME, function() {
    AppSocketActions.increaseVolume();
    console.debug('Increasing volume.');
  });

  socket.on(Events.DECREASE_VOLUME, function() {
    AppSocketActions.decreaseVolume();
    console.debug('Decreasing volume.');
  });

  socket.on(Events.INCREASE_TEMPO, function() {
    AppSocketActions.increaseTempo();
    console.debug('Increasing tempo.');
  });

  socket.on(Events.DECREASE_TEMPO, function() {
    AppSocketActions.decreaseTempo();
    console.debug('Decreasing tempo.');
  });

  socket.on(Events.CURRENT_DEVICE, function() {
    AppSocketActions.currentDevice();
  });

  var Connection = {
    notifyAwaitPosition: function() {
      socket.emit(Events.AWAITING_POSITION);
      console.debug('Awaiting position emitted.');
    }
  };

  return Connection;
});
