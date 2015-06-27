define(function(require) {
  var React = require('react-with-addons');

  var Router = require('react-router');
  var Route = Router.Route;
  var DefaultRoute = Router.DefaultRoute;

  var RouteNames = require('app/RouteNames');

  var App = require('app/App');

  var Routes = (
    <Route name={RouteNames.HOME} path="/" handler={App}>
    </Route>
  );

  return Routes;
});

