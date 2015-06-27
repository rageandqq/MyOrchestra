var BoundedArray = module.exports = function(s) {
  this.arr = [];
  this.size = s;
}

BoundedArray.prototype.push = function(val) {
  if (this.arr.length == this.size) {
    this.arr.shift();
  }
  this.arr.push(val);
};

BoundedArray.prototype.getArray = function() {
  return this.arr;
}

BoundedArray.prototype.clear = function() {
  this.arr = [];
}
