define(function(require) {
  var React = require('react-with-addons');

  var SetupContainer = require('app/setup/SetupContainer');
  var AwaitingContainer = require('app/setup/AwaitingContainer');
  var SoundContainer = require('app/sound/SoundContainer');

  var States = require('app/constants/AppConstants').States;

  var AppStore = require('app/stores/AppStore');

  require('css!app/__styles__/App.css');

  var App = React.createClass({
    componentDidMount: function() {
      document.title = 'MyOrchestra';
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

      if (this.state.state === States.SETTING_INSTRUMENT) {
        body = <SetupContainer />;
      } else if (this.state.state === States.AWAITING_POSITION) {
        body = <AwaitingContainer />;
      } else if (this.state.state === States.PLAYING){
        body = <SoundContainer />;
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

