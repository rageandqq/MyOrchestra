define(function(require) {
  var React = require('react-with-addons');
  var _ = require('underscore');

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
              {_(Instruments).map(function(type, name) {
                return (
                  <InstrumentButton
                    key={type}
                    name={name}
                    type={type}
                  />
                );
              })}
            </div>
          </div>

        </div>
      );
    }
  });

  return SetupContainer;
});
