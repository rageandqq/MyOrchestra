define(function(require) {

  var _ = require('underscore');

  var React = require('react-with-addons');
  var Instruments = require('app/constants/Instruments');
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
          <div className="sound-centering">
            <h1>{_(Instruments).keys()[this.state.currentInstrument]}</h1>
            <div className="sound-status">
              <p>
                <span className="sound-value">{this.state.volume}</span><br />
                <span className="sound-label">Volume</span>
              </p>
              <p>
                <span className="sound-value">{this.state.speed}</span><br />
                <span className="sound-label">Tempo</span>
              </p>
            </div>
          </div>
        </div>
      );
  	}

  }); // react class
  return SoundContainer;
}); // require
