define(function(require) {
  var _ = require('underscore');

  var AppDispatcher = require('app/dispatcher/AppDispatcher');
  var AppConstants = require('app/constants/AppConstants');
  var EventEmitter = require('event-emitter');
  var buzz = require('vendor/buzz');

  var Actions = AppConstants.Actions;
  var States = AppConstants.States;

  var CHANGE_EVENT = 'change';

  // Sound Files
  var soundFiles = ["sounds/Crash1.wav", "sounds/Crash2.wav", "sounds/Hat1.wav",
"sounds/Hat2.wav", "sounds/Hat3.wav", "sounds/Hat4.wav","sounds/Kick1.wav", "sounds/Kick2.wav", 
"sounds/Snare1.wav", "sounds/Snare2.wav", "sounds/Guitar1.mp3", "sounds/Violin1.mp3",
"sounds/Bass1.mp3", "sounds/Bass2.mp3", "sounds/Synth1.mp3"];

  soundFiles = _(soundFiles).map(function(file) {
    return "assets/" + file;
  });

// Initializing all sounds
var Sound1 = new buzz.sound(soundFiles[0]),
  Sound2 = new buzz.sound(soundFiles[1]),
  Sound3 = new buzz.sound(soundFiles[2]),
  Sound4 = new buzz.sound(soundFiles[3]),
  Sound5 = new buzz.sound(soundFiles[4]),
  Sound6 = new buzz.sound(soundFiles[5]),
  Sound7 = new buzz.sound(soundFiles[6]),
  Sound8 = new buzz.sound(soundFiles[7]),
  Sound9 = new buzz.sound(soundFiles[8]),
  Sound10 = new buzz.sound(soundFiles[9]),
  Sound11 = new buzz.sound(soundFiles[10]),
  Sound12 = new buzz.sound(soundFiles[11]),
  Sound13 = new buzz.sound(soundFiles[12]),
  Sound14 = new buzz.sound(soundFiles[13]),
  Sound15 = new buzz.sound(soundFiles[14]);

// Values for sound indexes
var crash = 0;
var hat = 2;
var kick = 6;
var snare = 8;
var guitar = 10;
var violin = 11;
var bass = 12;
var synth = 14;

// buzz.sounds is the array e.g buzz.sounds[0] is Sound1

buzz.all().load(); // Loading all sounds

var beatSounds = []; // array for keeping track of the sounds in beat

var beat = new buzz.group(); // our beat. Used as global sound player

function clearBeat(){ // clear the beat
  beat.pause(); // stop to prevent issues with beat
  beatSounds.splice(0, beatSounds.length); // emptying the array
  beat = new buzz.group(); // reset beat to be empty
}

// Add a certain sound to a beat
function addToBeat(sound){
  if(beatSounds.indexOf(sound) < 0){
    beat.pause(); // stop beat to prevent issues
    beatSounds.splice(0, beatSounds.length); // emptying the array
    beatSounds.push(sound);
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // re-play
  }
  console.log(beatSounds.length); // to help make sure length is accurate
}

// remove a certian sound from a beat
function removeFromBeat(sound){
  var index = beatSounds.indexOf(sound);
  if (index > -1){
    beat.pause(); // stop beat to prevent issues
    beatSounds.splice(index, 1);
    console.log("beat should be spliced");
    beat = new buzz.group(beatSounds);
    beat.loop().play(); // re-play
  }
  console.log(beatSounds.length); // to help make sure length is accurate
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

function doubleBeatSpeed(){ // double beat speed
  if(beat){
    beat.setSpeed(2);
  }
}

function normalBeatSpeed(){ // normalize beat speed
  if(beat){
    beat.setSpeed(1);
  }
}

function halfBeatSpeed(){ // half the beat speed
  if(beat){
    beat.setSpeed(0.5);
  }
}

function doubleSoundSpeed(sound){ // double a sound speed
  sound.setSpeed(2);
}

function normalSoundSpeed(sound){ // normalize a sound speed
  sound.setSpeed(1);
}

function halfSoundSpeed(sound){ // half a sound speed
  sound.setSpeed(0.5);
}

function fadeBeat(time){ // Fade the beat out given a duration of a fade
  beat.fadeOut(time);
}

function increaseSoundVolume(sound){ // increase a sound volume
  sound.increaseVolume(10);
}

function decreaseSoundVolume(sound){ // decrease a sound volume
  sound.decreaseVolume(10);
}

function increaseVolume(){ // increase beat volume
  beat.increaseVolume(10);
}

function decreaseVolume(){ // decrease beat volume
  beat.decreaseVolume(10);
}


  var SoundStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
      return {};
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

    }
  });

  return SoundStore;
});
