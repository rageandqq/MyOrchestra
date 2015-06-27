define(function(require) {
  var React = require('react-with-addons');

  var InstrumentButton = require('app/setup/InstrumentButton');
  var Instruments = require('app/constants/Instruments');

  require('css!app/setup/__styles__/SetupContainer.css');

  var SetupContainer = React.createClass({
    render: function() {
      return (
        <div className="r-SetupContainer">

          <div className="setup-centering">

            <p className="setup-title setup-text">MyOrchestra</p>
            <p className="setup-tagline setup-text">Rock to the beat of your own drums</p>

            <div className="setup-buttons">
              <InstrumentButton name="Drum 1" type={Instruments.DRUMS_1} />
              <InstrumentButton name="Drum 2" type={Instruments.DRUMS_2} />
              <InstrumentButton name="Drum 3" type={Instruments.DRUMS_3} />
            </div>
          </div>

        </div>
      );
    }
  });

  return SetupContainer;
});
