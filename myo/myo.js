//Dependencies
var Myo = require('myo');
var BoundedArray = require('../utils/bounded-array');

var MyoReader = module.exports = function(ServerHelper, debug) {
  //Constants
  var SAMPLE_PERIOD = 20;
  var Z_THRESHOLD = 0.1;
  var HEIGHT_THRESHOLD = 0.1;
  var ROTATION_THRESHOLD = 0.1;
  var HEIGHT_SAMPLE_SIZE = 4;
  var ROTATION_SAMPLE_SIZE = 4;
  var self = this;

  //instance variables
  this.debug = debug || true;
  this.delta = this.zVal = this.rotationValue = this.heightValue = 0;
  this.rotationState = this.heightState = 'none';

  this.locked = true;
  this.awaitingPosition = false;

  this.devices = [];
  this.heightSamples = new BoundedArray(HEIGHT_SAMPLE_SIZE);
  this.rotationSamples = new BoundedArray(ROTATION_SAMPLE_SIZE);
  this.currentDevice = null;

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
        myo.zeroOrientation(); //current orientation is now considered (0,0,0)
        console.log('unlocking Myo\n');
      }
      myo.vibrate();
    }
  }.bind(this));

  myo.on('fingers_spread', function(edge) {
    if (edge && !this.locked && this.awaitingPosition) {
      this.awaitingPosition = false;
      ServerHelper.addDevice(this.zVal);
    }
  }.bind(this));

  myo.on('imu', function(data) {
    this.delta++;
    if (this.delta >= SAMPLE_PERIOD){
      if (this.devices.length > 0)
        analyze(this.devices);
      this.delta %= SAMPLE_PERIOD;
      this.zVal = data.orientation.z; //set most recent zValue

      if (!this.locked) {

        if (this.debug) { //debug
          printDevices(this.devices);
          console.log('current device: ' + (this.currentDevice != null ? this.currentDevice.socket.id:'none'));
        }

        if (this.devices.length > 0) {
          //TODO: Fix overly sensitive rotation and height
          //handleRotation(data.accelerometer.y);
          //handleHeight(data.accelerometer.x);
        }
      }
    }
  }.bind(this));

  function handleRotation(val) {
    self.rotationSamples.push(val);
    var state = analyzeTrend(self.rotationSamples.getArray(), ROTATION_THRESHOLD);
    if (state == 'none' && state != self.rotationState) {
      if (self.rotationState == 'increasing') {
        console.log('increase tempo')
        ServerHelper.increaseTempo(self.currentDevice.socket);
      }
      else {
        console.log('decrease tempo')
        ServerHelper.decreaseTempo(self.currentDevice.socket);
      }

      self.locked = true; //lock temporarily
      setTimeout(function() {
        self.locked = false;
      }, 2000);
      self.rotationSamples.clear();
    }
    self.rotationState = state;
  }

  function handleHeight(val) {
    self.heightSamples.push(val);
    var state = analyzeTrend(self.heightSamples.getArray(), HEIGHT_THRESHOLD);
    if (state == 'none' && state != self.heightState) {
      if (self.heightState == 'increasing') {
        console.log('increase volume')
        ServerHelper.increaseVolume(self.currentDevice.socket);
      }
      else {
        console.log('decrease volume')
        ServerHelper.decreaseVolume(self.currentDevice.socket);
      }

      self.locked = true; //lock temporarily
      setTimeout(function() {
        self.locked = false;
      }, 2000);
      self.heightSamples.clear();
    }
    self.heightState = state;
  }

  function analyzeTrend(arr, thresh) {
    if (isIncreasing(arr, thresh))
      return 'increasing';
    if (isDecreasing(arr, thresh))
      return 'decreasing';
    return 'none';
  }

  function isIncreasing(arr, thresh) {
    var dist = 0;
    for (var i = 1; i < arr.length; i++) {
      dist += (arr[i] - arr[i-1]);
    }
    dist/= arr.length;
    return dist - thresh > 0;
  }

  function isDecreasing(arr, thresh) {
    var dist = 0;
    for (var i = 1; i < arr.length; i++) {
      dist += (arr[i] - arr[i-1]);
    }
    dist /= arr.length;
    return dist + thresh < 0;
  }

  //print device list
  function printDevices (deviceList) {
    if (deviceList.length > 0) {
      console.log('Device list: ');
      for (var i in deviceList) {
        console.log(deviceList[i].socket.id);
      }
      console.log('\n');
    } else {
      console.log('No devices in list');
    }
  }

  //analyze orientation for devices and update current device
  function analyze(deviceList) {
    for (var i in deviceList) {
      var d = deviceList[i];
      if (d.z >= self.zVal - Z_THRESHOLD && d.z <= self.zVal + Z_THRESHOLD) {
        self.currentDevice = d;
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
  console.log('new set of devices read by myo: ');
  console.log(devices);
  this.devices = devices;
}

//change to awaiting position state
MyoReader.prototype.awaitPosition = function() {
  this.awaitingPosition = true;
};
