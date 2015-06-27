define(function(require) {
  var React = require('react-with-addons');

  var SetupContainer = require('app/setup/SetupContainer');

  require('css!app/__styles__/App.css');

  var States = {
    Setup: 0,
    Playing: 1
  };

  var App = React.createClass({
    componentDidMount: function() {
      document.title = 'TeleBeat';
    },

    getInitialState: function() {
      return {
        state: States.Setup
      };
    },

    render: function() {
      return (
        <div className="r-App">
          <SetupContainer />
        </div>
      );
    }
  });

  return App;
});

