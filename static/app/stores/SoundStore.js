define(function(require) {
  var _ = require('underscore');

  var AppDispatcher = require('app/dispatcher/AppDispatcher');
  var AppConstants = require('app/constants/AppConstants');
  var EventEmitter = require('event-emitter');
  var buzz = require('vendor/buzz');

  var Actions = AppConstants.Actions;
  var States = AppConstants.States;

  var CHANGE_EVENT = 'change';

  var isCurrentDevice = false;
  var currentInstrument = -1;

  // Sound Files
  var soundFiles = ["sounds/Crash1.wav", "sounds/Hat4.wav", "sounds/Kick1.wav", "sounds/Kick2.wav",
"sounds/Snare1.wav", "sounds/Guitar1.wav", "sounds/Violin1.wav",
"sounds/Bass1.wav", "sounds/Bass2.wav", "sounds/Synth1.wav"];

  soundFiles = _(soundFiles).map(function(file) {
    return "/assets/" + file;
  });

// Initializing all sounds\
var Sound1 = new buzz.sound(soundFiles[0]),
  Sound2 = new buzz.sound(soundFiles[1]),
  Sound3 = new buzz.sound(soundFiles[2]),
  Sound4 = new buzz.sound(soundFiles[3]),
  Sound5 = new buzz.sound(soundFiles[4]),
  Sound6 = new buzz.sound(soundFiles[5]),
  Sound7 = new buzz.sound(soundFiles[6]),
  Sound8 = new buzz.sound(soundFiles[7]),
  Sound9 = new buzz.sound(soundFiles[8]),
  Sound10 = new buzz.sound(soundFiles[9]);


// buzz.sounds is the array e.g buzz.sounds[0] is Sound1

buzz.all().load(); // Loading all sounds

var beatSounds = []; // array for keeping track of the sounds in beat

var beat = new buzz.group(); // our beat. Used as global sound player

function clearBeat(){ // clear the beat
  beat.pause(); // stop to prevent issues with beat
  beatSounds.splice(0, beatSounds.length); // emptying the array
  beat = new buzz.group(); // reset beat to be empty
}

function playSound(sound){ // Changes sound played
  if(beatSounds.indexOf(sound) < 0){
    beat.pause(); // stop beat to prevent issues
    beatSounds.splice(0, beatSounds.length); // emptying the array
    beatSounds.push(sound);
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // re-play
  }
}

// Add a certain sound to a beat
function addToBeat(sound){
  if(beatSounds.indexOf(sound) < 0){
    beat.pause(); // stop beat to prevent issues
    beatSounds.push(sound);
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // re-play
  }
}

// remove a certain sound from a beat
function removeFromBeat(sound){
  var index = beatSounds.indexOf(sound);
  if (index > -1){
    beat.pause(); // stop beat to prevent issues
    beatSounds.splice(index, 1);
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // re-play
  }
}

// Given a sound, it will toggle it playing from the beat
// This probably makes removing and adding to beat useless for our purposes
function toggleFromBeat(sound){
  var index = beatSounds.indexOf(sound);
  if(index > -1){
    beat.pause(); // stop beat to prevent issues
    beatSounds.splice(index, 1);
    console.log("beat should be spliced");
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // replay
  } else {
    beat.pause(); // stop beat to prevent issues
    beatSounds.push(sound);
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // replay
  }
}

function playBeat(){ // Play Beat
  if(beat){
    beat.loop().togglePlay();
  }
}

function increaseSoundSpeed(sound){ // Double Sound Speed
  beat.pause();
  if (sound.getSpeed() === 0.5){
    sound.setSpeed(1);
  } else if(sound.getSpeed() === 1){
    sound.setSpeed(1.5);
  } else if(sound.getSpeed() === 1.5){
    sound.setSpeed(2);
  } else if(sound.getSpeed() === 2){
    sound.setSpeed(2.5);
  } else if(sound.getSpeed() === 2.5){
    sound.setSpeed(3);
  } else if(sound.getSpeed() === 3){
    sound.setSpeed(3.5);
  } else if(sound.getSpeed() === 3.5){
    sound.setSpeed(4);
  } 
  beat.loop().play();
}

function decreaseSoundSpeed(sound){ // Halve Speed
  beat.pause();
  if(sound.getSpeed() === 1){
    sound.setSpeed(0.5);
  } else if(sound.getSpeed() === 1.5){
    sound.setSpeed(1);
  } else if(sound.getSpeed() === 2){
    sound.setSpeed(1.5);
  } else if(sound.getSpeed() === 2.5){
    sound.setSpeed(2);
  } else if(sound.getSpeed() === 3){
    sound.setSpeed(2.5);
  } else if(sound.getSpeed() === 3.5){
    sound.setSpeed(3);
  } else if(sound.getSpeed() === 4){
    sound.setSpeed(3.5);
  }
  beat.loop().play();
}

function increaseSoundVolume(sound){ // increase a sound volume
  beat.pause();
  sound.increaseVolume(10);
  beat.loop().play();
}

function decreaseSoundVolume(sound){ // decrease a sound volume
  beat.pause();
  sound.decreaseVolume(10);
  beat.loop().play();
}

function fadeBeat(time){ // Fade the beat out given a duration of a fade
  beat.fadeOut(time);
}

function resetCurrentDevice() {
  isCurrentDevice = false;
  SoundStore.emitChange();
}

var debouncedResetCurrentDevice = _(resetCurrentDevice).debounce(500);

  var SoundStore = _.extend({}, EventEmitter.prototype, {

    getState: function() {
      return {
        isCurrentDevice: isCurrentDevice,
        volume: buzz.sounds[currentInstrument].getVolume(),
        currentInstrument: currentInstrument,
        speed: buzz.sounds[currentInstrument].getSpeed()

      };
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  });

  // Register callback to handle all updates
  SoundStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case Actions.CURRENT_DEVICE:
        if (!isCurrentDevice) {
          isCurrentDevice = true;
          SoundStore.emitChange();
        }
        debouncedResetCurrentDevice();
        break;

      case Actions.SET_INSTRUMENT:
        currentInstrument = action.instrument;
        SoundStore.emitChange();
        break;

      case Actions.START_PLAYING:
        addToBeat(buzz.sounds[currentInstrument]);
        SoundStore.emitChange();
        break;

      case Actions.INCREASE_TEMPO:
        increaseSoundSpeed(buzz.sounds[currentInstrument]);
        SoundStore.emitChange();
        break;

      case Actions.DECREASE_TEMPO:
        decreaseSoundSpeed(buzz.sounds[currentInstrument]);
        SoundStore.emitChange();
        break;

      case Actions.INCREASE_VOLUME:
        increaseSoundVolume(buzz.sounds[currentInstrument]);
        SoundStore.emitChange();
        break;

      case Actions.DECREASE_VOLUME:
        decreaseSoundVolume(buzz.sounds[currentInstrument]);
        SoundStore.emitChange();
        break;

    }
  });

  return SoundStore;
});
