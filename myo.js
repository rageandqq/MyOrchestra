var timer = 0;
var locked = true;
var M = require('myo');

var myo = Myo.create();

myo.on('connected', function() {
  myo.setLockingPolicy('none');
  locked = false;
});

myo.on('fist', function(edge){
  if (edge) { //edge is true on start of pose
    locked = !locked;
    if (locked) {
      console.log("locking Myo\n");
    } else {
      console.log("unlocking Myo\n");
    }
  }
});

myo.on('imu', function(data) {
  timer++;
  if (timer >= 60){
    timer %= 60;
    if (!locked) {
      console.log("Gyroscope");
      printGyroscope(data.gyroscope);
      console.log("Orientation");
      printOrientation(data.orientation);
      console.log("\n");
    }
  }
});

function printGyroscope(g) {
  console.log("x: " + g.x);
  console.log("y: " + g.y);
  console.log("z: " + g.z);
}

function printOrientation(o) {
  printGyroscope(o);
  console.log("W: " + o.W);
}
