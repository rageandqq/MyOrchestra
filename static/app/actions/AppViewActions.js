define(function(require) {
  var AppDispatcher = require('app/dispatcher/AppDispatcher');
  var Actions = require('app/constants/AppConstants').Actions;

  var Connection = require('app/socket/Connection');

  var AppViewActions = {
    setInstrument: function(instrument) {
      AppDispatcher.handleViewAction({
        actionType: Actions.SET_INSTRUMENT,
        instrument: instrument
      });

      Connection.notifyAwaitPosition();
    }
  };

  return AppViewActions;
});
