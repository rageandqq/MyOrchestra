requirejs.config({
  baseUrl: '/assets',

  paths: {
    'react-with-addons': 'vendor/react-with-addons-v0-12-2',
    'react-router': 'vendor/react-router-v0-11-6',
    'underscore': 'vendor/underscore-v1-8-2',
    'react-shim': 'vendor/react-shim'
  },

  shim: {
    'react-router': {
      deps: ['react-shim'],
      exports: 'Router'
    }
  },

  map: {
    '*': {
      'css': 'vendor/css-v0-1-2',
      'text': 'vendor/text',
      'json': 'vendor/json'
    }
  }
});

define(function(require) {
  var React = require('react-with-addons');
  var Router = require('react-router');
  var Routes = require('app/Routes');

  var wrapper = document.getElementById('wrapper');

  Router.run(Routes, Router.HistoryLocation, function(Handler) {
    React.render(React.createElement(Handler), wrapper);
  });
});
