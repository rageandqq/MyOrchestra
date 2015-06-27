define(function(require) {

  var React = require('react-with-addons');

  var States = require('app/constants/AppConstants').States;
  var SoundStore = require('app/stores/SoundStore');

  require("css!app/sound/__styles__/SoundContainer.css");

  var SoundContainer = React.createClass({

  	getInitialState: function(){
  		return SoundStore.getState();
  	},

  	componentWillUnmount: function() {
  		SoundStore.removeChangeListener(this.updateState);

  	},

  	componentDidMount: function() {
  		SoundStore.addChangeListener(this.updateState);

  	},

  	updateState: function() {
  		this.setState(SoundStore.getState());

  	},

	render: function() {
	    var classes = React.addons.classSet({
	      'r-SoundContainer': true,
	      'current-device': this.state.isCurrentDevice
	    });

      return (
        <div className={classes}>
        </div>
      );
  	}

  }); // react class
  return SoundContainer;
}); // require
