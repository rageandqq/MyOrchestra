 var Myo = require('myo');

 var myMyo = Myo.create();
 myMyo.on('fist', function(edge){
       if(!edge) return;
           console.log('Hello Myo!');
               myMyo.vibrate();
 });
console.log("begin");
