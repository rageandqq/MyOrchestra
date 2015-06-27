define(function(require) {
  var React = require('react-with-addons');

  require('css!app/setup/__styles__/InstrumentButton.css');

  var InstrumentButton = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired
    },

    render: function() {
      return (
        <button className="r-InstrumentButton">
          <p>{this.props.name}</p>
        </button>
      );
    }
  });

  return InstrumentButton;
});
