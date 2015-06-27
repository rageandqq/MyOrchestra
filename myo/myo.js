//Globals
var delta = 0;
var locked = true;
var awaitingPosition = false;
var server = null;
var zVal = 0;

//Constants
var FREQUENCY = 30;
var THRESHOLD = 0.1;

var M = require('myo');
var myo = Myo.create();

myo.on('connected', function() {
  myo.setLockingPolicy('none');
});

myo.on('fist', function(edge){
  if (edge) { //edge is true on start of pose
    locked = !locked;
    if (locked) {
      console.log('locking Myo\n');
    } else {
      myo.zeroOrientation(); //current orientation is now considered 'home'
      console.log('unlocking Myo\n');
    }
    myo.vibrate();
  }
});

myo.on('fingers_spread', function(edge) {
  if (edge && !locked && awaitingPosition && server != null) { //edge is true on start of pose (don't want to repeat twice)
    server.addDevice(zVal);
    awaitingPosition = false;
  }
});

myo.on('imu', function(data) {
  delta++;
  if (delta >= FREQUENCY){
    delta %= FREQUENCY;
    zVal = data.orientation.z; //set most recent zValue
    if (!locked) {
      //noop, report any values here
    }
  }
});

function printDevices (devices) {
  if (devices.length != 0) {
    console.log('Device list: ');
    for (var i in devices) {
      console.log(devices[i].name);
    }
  } else {
    console.log('No devices in list');
  }
}

function analyze(devices) {
  for (var i in devices) {
    var d = devices[i];
    if (d.z >= zVal - THRESHOLD && d.z <= zVal + THRESHOLD) {
      currentDeviceName = d.name; //update current device pointed to
    }
  }
}

function printXYZ(d) {
  console.log('x: ' + d.x);
  console.log('y: ' + d.y);
  console.log('z: ' + d.z);
}
