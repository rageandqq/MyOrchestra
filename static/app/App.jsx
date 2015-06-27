define(function(require) {
  var React = require('react-with-addons');
  var ReactRouter = require('react-router');
  var RouteHandler = ReactRouter.RouteHandler;

  var App = React.createClass({
    componentDidMount: function() {
      document.title = 'TeleBeat';
    },

    render: function() {
      return (
        <div className="r-TeleBeat">
          <RouteHandler />
        </div>
      );
    }
  });

  return App;
});

