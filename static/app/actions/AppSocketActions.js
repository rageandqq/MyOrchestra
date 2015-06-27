define(function(require) {
  var AppDispatcher = require('app/dispatcher/AppDispatcher');
  var Actions = require('app/constants/AppConstants').Actions;

  var AppSocketActions = {
    startPlaying: function(){
      AppDispatcher.handleSocketAction({
        actionType: Actions.START_PLAYING
      });
    },

    increaseTempo: function() {
      AppDispatcher.handleSocketAction({
        actionType: Actions.INCREASE_TEMPO
      });
    },

    decreaseTempo: function() {
      AppDispatcher.handleSocketAction({
        actionType: Actions.DECREASE_TEMPO
      });
    },

    increaseVolume: function() {
      AppDispatcher.handleSocketAction({
        actionType: Actions.INCREASE_VOLUME
      });
    },

    decreaseVolume: function() {
      AppDispatcher.handleSocketAction({
        actionType: Actions.DECREASE_VOLUME
      });
    },

    currentDevice: function() {
      AppDispatcher.handleSocketAction({
        actionType: Actions.CURRENT_DEVICE
      });
    }
  };

  return AppSocketActions;
});
