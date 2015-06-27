define(function(require) {
  var _ = require('underscore');
  var Dispatcher = require('vendor/Dispatcher');

  var Sources = require('app/constants/AppConstants').Sources;

  var AppDispatcher = new Dispatcher();

  AppDispatcher.handleViewAction = function(action) {
    this.dispatch({
      source: Sources.VIEW,
      action: action
    });
  }

  AppDispatcher.handleSocketAction = function(action) {
    this.dispatch({
      source: Sources.SOCKET,
      action: action
    });
  }

  return AppDispatcher;
});
