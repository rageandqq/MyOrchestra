define(function(require) {
  var AppDispatcher = require('app/dispatcher/AppDispatcher');
  var Actions = require('app/constants/AppConstants').Actions;

  var AppSocketActions = {
  	startPlaying: function(){
  		AppDispatcher.handleSocketAction({
  		  actionType: Actions.START_PLAYING
  		});
  	}
  };

  return AppSocketActions;
});
