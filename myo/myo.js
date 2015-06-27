var MyoReader = module.exports = function(ServerInit) {
  //Dependencies
  var M = require('myo');

  //Globals
  var delta = 0;
  var locked = true;
  var zVal = 0;

  this.awaitingPosition = false;
  this.server = ServerInit.server;

  //Constants
  var FREQUENCY = 30;
  var THRESHOLD = 0.1;

  //Create myo connection
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
    if (edge && !locked && this.awaitingPosition && this.server != null) { //edge is true on start of pose (don't want to repeat twice)
      ServerInit.addDevice(zVal);
      this.awaitingPosition = false;
    }
  }.bind(this));

  myo.on('imu', function(data) {
    delta++;
    if (delta >= FREQUENCY){
      delta %= FREQUENCY;
      zVal = data.orientation.z; //set most recent zValue
      if (!locked) {
        //noop, report any values here
        console.log('Orientation');
        printXYZ(data.orientation);
        console.log('Accelerometer');
        printXYZ(data.accelerometer);
        console.log('Gyroscope');
        printXYZ(data.gyroscope);
        console.log('AwaitingPosition:' + this.awaitingPosition);
        if (this.server != null)
          console.log('Server:' + this.server.toString());
        console.log('\n');
      }
    }
  }.bind(this));


  //print device list (unused)
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

  //analyze orientation for devices and update current device (currently unused)
  function analyze(devices) {
    for (var i in devices) {
      var d = devices[i];
      if (d.z >= zVal - THRESHOLD && d.z <= zVal + THRESHOLD) {
        currentDeviceName = d.name; //update current device pointed to
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

//change to awaiting position state
MyoReader.prototype.awaitPosition = function() {
  this.awaitingPosition = true;
};
