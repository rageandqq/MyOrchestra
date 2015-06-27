define(function() {
  return {

    Sources: {
      VIEW: 'view',
      SOCKET: 'socket'
    },

    Actions: {
      SET_INSTRUMENT: 'setInstrument',
      START_PLAYING: 'startPlaying',
      INCREASE_TEMPO: 'increaseTempo',
      DECREASE_TEMPO: 'decreaseTempo',
      INCREASE_VOLUME: 'increaseVolume',
      DECREASE_VOLUME: 'decreaseVolume',
      CURRENT_DEVICE: 'currentDevice'
    },

    States: {
      SETTING_INSTRUMENT: 'settingInstrument',
      AWAITING_POSITION: 'awaitingPosition',
      PLAYING: 'playing'
    }

  };
});
