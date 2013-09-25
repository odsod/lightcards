var _ = require('underscore');

var Shuffler = module.exports.Shuffler = function(list) {
  this.list = list;
  this.shuffledList = [];
};

Shuffler.prototype.next = function() {
  if (this.shuffledList.length === 0) {
    this.shuffledList = _.shuffle(this.list.slice());
  }
  return this.shuffledList.pop();
};

Shuffler.prototype.remove = function(item) {
  this.list = _.without(this.list, item);
  this.shuffledList = _.without(this.shuffledList, item);
};

Shuffler.prototype.add = function(item) {
  this.list.push(item);
  this.list = _.unique(this.list);
};

Shuffler.prototype.length = function() {
  return this.list.length;
};
