//Globals
var delta = 0;
var locked = true;
//Constants
var FREQUENCY = 30;

var M = require('myo');

var myo = Myo.create();

myo.on('connected', function() {
  myo.setLockingPolicy('none');
});

myo.on('fist', function(edge){
  if (edge) { //edge is true on start of pose
    locked = !locked;
    if (locked) {
      console.log("locking Myo\n");
    } else {
      myo.zeroOrientation(); //current orientation is now considered "home"
      console.log("unlocking Myo\n");
    }
    myo.vibrate();
  }
});

myo.on('imu', function(data) {
  delta++;
  if (delta >= FREQUENCY){
    delta %= FREQUENCY;
    if (!locked) {
      console.log("Accelerometer");
      printXYZ(data.accelerometer);
      console.log("Gyroscope");
      printXYZ(data.gyroscope);
      console.log("Orientation");
      printXYZ(data.orientation);
      console.log("\n");
    }
  }
});

function printXYZ(d) {
  console.log("x: " + d.x);
  console.log("y: " + d.y);
  console.log("z: " + d.z);
}
