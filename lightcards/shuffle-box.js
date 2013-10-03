var _ = require('underscore');

var ShuffleBox = module.exports.ShuffleBox = function(items) {
  this.items = items || [];
  this.shuffledItems = [];
};

ShuffleBox.prototype.next = function(n) {
  if (this.shuffledItems.length < n) {
    this.shuffledItems = _.shuffle(this.items);
  }
  var next = this.shuffledItems.slice(0, n);
  this.shuffledItems = this.shuffledItems.slice(n);
  return next;
};

ShuffleBox.prototype.remove = function(item) {
  this.items = _(this.items).without(item);
  this.shuffledItems = _(this.shuffledItems).without(item);
};

ShuffleBox.prototype.contains = function(item) {
  return _(this.items).contains(item);
};

ShuffleBox.prototype.add = function(item) {
  this.items = _(this.items.concat(item)).unique();
};

ShuffleBox.prototype.size = function() {
  return this.items.length;
};
