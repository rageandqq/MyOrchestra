//Dependencies
var Myo = require('myo');
var BoundedArray = require('../utils/bounded-array');

var MyoReader = module.exports = function(ServerHelper, debug) {
  //Constants
  var SAMPLE_PERIOD = 20;
  var Z_THRESHOLD = 0.1;
  var HEIGHT_THRESHOLD = 0.1;
  var HEIGHT_SAMPLE_SIZE = 4;
  var self = this;

  //instance variables
  this.delta = 0;
  this.locked = true;
  this.zVal = 0;
  this.awaitingPosition = false;
  this.rotationValue = 0;
  this.heightValue = 0;
  this.rotationRest = true;
  this.heightRest = true;
  this.devices = [];
  this.debug = debug || true;
  this.heightSamples = new BoundedArray(HEIGHT_SAMPLE_SIZE);
  this.heightState = 'none';
  this.currentDevice = null;
  this.currentDeviceName = 'none';

  //Create myo connection
  var myo = Myo.create();

  myo.on('connected', function() {
    myo.setLockingPolicy('none');
  });

  myo.on('double_tap', function(edge){
    if (edge) { //edge is true on start of pose
      this.locked = !this.locked;
      if (this.locked) {
        console.log('locking Myo\n');
      } else {
        myo.zeroOrientation(); //current orientation is now considered 'home'
        console.log('unlocking Myo\n');
      }
      myo.vibrate();
    }
  }.bind(this));

  myo.on('fingers_spread', function(edge) {
    if (edge && !this.locked && this.awaitingPosition) {
      console.log('added device at pos: ' + this.zVal);
      this.awaitingPosition = false;
      ServerHelper.addDevice(this.zVal);
    }
  }.bind(this));

  myo.on('imu', function(data) {
    this.delta++;
    if (this.delta >= SAMPLE_PERIOD){
      this.delta %= SAMPLE_PERIOD;
      this.zVal = data.orientation.z; //set most recent zValue
      if (!this.locked) {
        if (this.devices.length > 0) {
          analyze(this.devices);
        }
        if (this.debug) {
          printDevices(this.devices); //print device list
        }
        //handleRotation(data.accelerometer.y); //TODO: IMPLEMENT
        handleHeight(data.accelerometer.x);
        console.log('current device: ' + this.currentDeviceName);
      }
    }
  }.bind(this));

  function handleHeight(val) {
    self.heightSamples.push(val);
    var state = analyzeTrend(self.heightSamples.getArray());
    if (state == 'none' && state != self.heightState) {
      if (self.heightState == 'increasing') {
        //TODO: Use Callback from Server
        console.log('increase volume')
      }
      else {
        //TODO: Use Callback from Server
        console.log('decrease volume')
      }
      self.locked = true;
      setTimeout(function() {
        self.locked = false;
      }, 2000);

      self.heightSamples.clear();
    }
    self.heightState = state;
  }

  function analyzeTrend(arr) {
    if (isIncreasing(arr))
      return 'increasing';
    if (isDecreasing(arr))
      return 'decreasing';
    return 'none';
  }

  function isIncreasing(arr) {
    var dist = 0;
    for (var i = 1; i < arr.length; i++) {
      dist += (arr[i] - arr[i-1]);
    }
    dist/= arr.length;
    return dist - HEIGHT_THRESHOLD > 0;
  }

  function isDecreasing(arr) {
    var dist = 0;
    for (var i = 1; i < arr.length; i++) {
      dist += (arr[i] - arr[i-1]);
    }
    dist /= arr.length;
    return dist + HEIGHT_THRESHOLD < 0;
  }

  function handleRotation(val) {
    if (self.debug) {
      console.log('Rotation: ' + val);
    }
  }

  //print device list (unused)
  function printDevices (devices) {
    if (devices.length > 0) {
      console.log('Device list: ');
      for (var i in devices) {
        console.log(devices[i].socket.id);
      }
      console.log('\n');
    } else {
      console.log('No devices in list');
    }
  }

  //analyze orientation for devices and update current device (currently unused)
  function analyze(devices) {
    for (var i in devices) {
      var d = devices[i];
      if (d.z >= this.zVal - Z_THRESHOLD && d.z <= this.zVal + Z_THRESHOLD) {
        this.currentDeviceName = d.id; //update current device pointed to
        this.currentDevice = d;
      }
    }
  }

  //helper function to print x,y,z coordinates of object
  function printXYZ(d) {
    console.log('x: ' + d.x);
    console.log('y: ' + d.y);
    console.log('z: ' + d.z);
  }
}

//set list of devices
MyoReader.prototype.setDevices = function(devices) {
  if (this.debug) {
    console.log('new set of devices read by myo: ');
    console.log(devices);
  }
  this.devices = devices;
}

//change to awaiting position state
MyoReader.prototype.awaitPosition = function() {
  this.awaitingPosition = true;
};
