define(function(require) {
  var React = require('react-with-addons');

  var SetupContainer = require('app/setup/SetupContainer');
  var States = require('app/constants/AppConstants').States;

  var AppStore = require('app/stores/AppStore');

  require('css!app/__styles__/App.css');

  var App = React.createClass({
    componentDidMount: function() {
      document.title = 'TeleBeat';
      AppStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      AppStore.removeChangeListener(this.updateState);
    },

    getInitialState: function() {
      return AppStore.getState();
    },

    updateState: function() {
      this.setState(AppStore.getState());
    },

    render: function() {
      var body = '';

      if (this.state.state == States.SETTING_INSTRUMENT) {
        body = <SetupContainer />
      }

      return (
        <div className="r-App">
          {body}
        </div>
      );
    }
  });

  return App;
});

