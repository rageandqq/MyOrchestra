//Globals
var delta = 0;
var locked = true;

var deviceSet = [];
var zVal = 0;
var currentDeviceName = 'NONE';
var nextDeviceNum = 0;

//Device Model
function Device(name, z) {
  this.name = name;
  this.z = z;
}

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
  if (edge && !locked) { //edge is true on start of pose (don't want to repeat twice)
    currentDeviceName = 'DEVICE ' + (++nextDeviceNum);
    var d = new Device('DEVICE ' + nextDeviceNum, zVal);
    deviceSet.push(d);
    console.log("Device created; " + d.name + ": " + d.z);
  }
});

myo.on('imu', function(data) {
  delta++;
  if (delta >= FREQUENCY){
    delta %= FREQUENCY;
    zVal = data.orientation.z; //set most recent zValue
    if (!locked) {
      analyze(); //determine where myo is pointing to
      printDevices(deviceSet);
      console.log('current device: ' + currentDeviceName);
      console.log('current zVal: ' + zVal + '\n');
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

function analyze() {
  //noop TODO: work on this
  for (var i in deviceSet) {
    var d = deviceSet[i];
    if (d.z >= zVal - THRESHOLD && d.z <= zVal + THRESHOLD) {
      currentDeviceName = d.name;
    }
  }
}

function printXYZ(d) {
  console.log('x: ' + d.x);
  console.log('y: ' + d.y);
  console.log('z: ' + d.z);
}
