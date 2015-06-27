define(function() {
  return {

    Sources: {
      VIEW: 'view',
      SOCKET: 'socket'
    },

    Actions: {
      SET_INSTRUMENT: 'setInstrument'
    },

    States: {
      SETTING_INSTRUMENT: 'settingInstrument',
      AWAITING_POSITION: 'awaitingPosition',
      PLAYING: 'playing'
    }

  };
});
