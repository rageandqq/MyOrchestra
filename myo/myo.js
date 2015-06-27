//Dependencies
var Myo = require('myo');

var MyoReader = module.exports = function(ServerHelper, debug) {
  //Constants
  var FREQUENCY = 30;
  var THRESHOLD = 0.1;
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
      this.awaitingPosition = false;
      ServerHelper.addDevice(this.zVal);
    }
  }.bind(this));

  myo.on('imu', function(data) {
    this.delta++;
    if (this.delta >= FREQUENCY){
      this.delta %= FREQUENCY;
      this.zVal = data.orientation.z; //set most recent zValue
      if (!this.locked) {
        if (this.devices.length > 0) {
          analyze(this.devices);
        }
        if (this.debug) {
          printDevices(this.devices); //print device list 
        }
        //handleHeight(data.accelerometer.x);
        //handleRotation(data.accelerometer.y);
      }
    }
  }.bind(this));

  var currentVolume = 0;
  var motionVolumefactor = 5;
  var xThreshold = 0.2;
  //0 horizontal 1 vertical 
  function handleHeight(val, val_prev) {
    if (Math.abs(val - val_prev) < xThreshold && (val - val_prev) > 0) { 
      currentVolume+=motionVolumefactor; 
      console.log('current volume: ' + currentVolume);
    };
    if (Math.abs(val-val_prev) < xThreshold && (val-val_prev) < 0){
      currentVolume-=motionVolumefactor;
      console.log('currentVolume: '+ currentVolume);
    }
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
      if (d.z >= this.zVal - THRESHOLD && d.z <= this.zVal + THRESHOLD) {
        this.currentDeviceName = d.id; //update current device pointed to
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
