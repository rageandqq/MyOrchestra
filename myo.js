var M = require('myo');

var myo = Myo.create();

myo.on('connected', function() {
  myo.setLockingPolicy('none');
});

myo.on('fist', function() {
  myo.vibrate();
});
