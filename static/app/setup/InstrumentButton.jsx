define(function(require) {
  var React = require('react-with-addons');

  var AppViewActions = require('app/actions/AppViewActions');

  require('css!app/setup/__styles__/InstrumentButton.css');

  var InstrumentButton = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired
    },

    handleClick: function() {
      AppViewActions.setInstrument(this.props.type);
    },

    render: function() {
      return (
        <button className="r-InstrumentButton" onClick={this.handleClick}>
          <p>{this.props.name}</p>
        </button>
      );
    }
  });

  return InstrumentButton;
});
