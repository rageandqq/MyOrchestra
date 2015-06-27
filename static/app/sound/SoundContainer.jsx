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
  		SoundStore.removeChangeListener();

  	},

  	componentDidMount: function() {
  		SoundStore.addChangeListener();

  	},

  	updateState: function() {
  		this.setState(SoundStore.getState());

  	},

	render: function() {
      return (
        <div className="r-SoundContainer">
        </div>
      );
  	}

  }); // react class
  return SoundContainer;
}); // require
