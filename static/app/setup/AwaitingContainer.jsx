define(function(require) {
  var React = require('react-with-addons');

  require('css!app/setup/__styles__/AwaitingContainer.css');

  var AwaitingContainer = React.createClass({
    render: function() {
      return (
        <div className="r-AwaitingContainer">
          <div className="awaiting-centering">
            <p className="awaiting-message">Position this device to your liking.</p>

            <div className="awaiting-spinner"></div>
          </div>
        </div>
      );
    }
  });

  return AwaitingContainer;
});

