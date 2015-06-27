//Dependencies
var Myo = require('myo');
var BoundedArray = require('../utils/bounded-array');

var MyoIO = module.exports = function(ServerHelper, debug) {
  //Constants
  var SAMPLE_PERIOD = 20;
  var Z_THRESHOLD = 0.07;
  var HEIGHT_THRESHOLD = 0.15;
  var ROTATION_THRESHOLD = 0.15;
  var HEIGHT_SAMPLE_SIZE = 4;
  var ROTATION_SAMPLE_SIZE = 4;
  var TEMPORARY_LOCK_TIMER = 1200;
  var self = this;

  //instance variables
  this.debug = debug;
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
        if (this.debug)
          console.log('locking Myo\n');
      } else {
        myo.zeroOrientation(); //current orientation is now considered (0,0,0)
        if (this.debug)
          console.log('unlocking Myo\n');
        this.heightSamples.clear();
        this.rotationSamples.clear();
      }
      myo.vibrate();
    }
  }.bind(this));

  myo.on('fist', function(edge) {
    if (edge && !this.locked && this.awaitingPosition) {
      this.awaitingPosition = false;
      ServerHelper.addDevice(this.zVal);
    }
  }.bind(this));

  myo.on('imu', function(data) {
    this.delta++;
    if (this.delta >= SAMPLE_PERIOD){
      if (this.devices.length > 0)
        analyzeCurrentDevice(this.devices);
      this.delta %= SAMPLE_PERIOD;
      this.zVal = data.orientation.z; //set most recent zValue

      if (!this.locked) {
        //sample when not locked
        this.heightSamples.push({device: self.currentDevice, val: data.accelerometer.x});
        this.rotationSamples.push({device: self.currentDevice, val: data.accelerometer.y});

        if (this.debug) { //debug
          printDevices(this.devices);
          console.log('current device: ' + (this.currentDevice != null ? this.currentDevice.socket.id:'none'));
          console.log('current z: ' + this.zVal);
        }

        analyzeRotation(data.accelerometer.y, this.currentDevice);
        analyzeHeight(data.accelerometer.x, this.currentDevice);
      }

      if (this.currentDevice != null && !this.locked) {
        ServerHelper.heartbeat(this.currentDevice.socket); //emit heartbeat
      }
    }
  }.bind(this));

  myo.on('wave_in', function(edge) {
    if (edge) {
      if (this.debug)
        console.log('muting all');
      ServerHelper.emitAll('mute');
    }
  }.bind(this));

  myo.on('wave_out', function(edge) {
    if (edge) {
      if (this.debug)
        console.log('unmuting all');
      ServerHelper.emitAll('unmute');
    }
  }.bind(this));

  function analyzeRotation(val, device) {
    var state = analyzeTrend(self.rotationSamples.getArray().map(function(r){
      return r.val;
    }), ROTATION_THRESHOLD);
    var sampleDev = self.rotationSamples.getArray()[0].device;
    if (state == 'none' && state != self.rotationState && sampleDev != null) {
      if (self.rotationState == 'increasing') {
        if (self.debug)
          console.log('increase tempo')
        ServerHelper.increaseTempo(sampleDev.socket);

      }
      else {
        if (self.debug)
          console.log('decrease tempo')
        ServerHelper.decreaseTempo(sampleDev.socket);
      }

      self.locked = true; //lock temporarily
      self.rotationSamples.clear();

      setTimeout(function() {
        self.locked = false;
      }, TEMPORARY_LOCK_TIMER);


    }
    self.rotationState = state;
  }

  function analyzeHeight(val, device) {
    var state = analyzeTrend(self.heightSamples.getArray().map(function(h) {
      return h.val;
    }), HEIGHT_THRESHOLD);
    var sampleDev = self.heightSamples.getArray()[0].device;
    if (state == 'none' && state != self.heightState && sampleDev != null) {
      if (self.heightState == 'increasing') {
        if (self.debug)
          console.log('increase volume')
        ServerHelper.increaseVolume(sampleDev.socket);

      }
      else {
        if (self.debug)
          console.log('decrease volume')
        ServerHelper.decreaseVolume(sampleDev.socket);
      }

      self.locked = true; //lock temporarily
      self.heightSamples.clear();

      setTimeout(function() {
        self.locked = false;
      }, TEMPORARY_LOCK_TIMER);

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
        console.log(deviceList[i].socket.id + ', location: ' + deviceList[i].z);
      }
      console.log('\n');
    } else {
      console.log('No devices in list');
    }
  }

  //analyze orientation for devices and update current device
  function analyzeCurrentDevice(deviceList) {
    self.currentDevice = null;
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
MyoIO.prototype.setDevices = function(devices) {
  this.devices = devices;
}

//change to awaiting position state
MyoIO.prototype.awaitPosition = function() {
  this.awaitingPosition = true;
};
