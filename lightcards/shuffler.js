var _ = require('underscore');

var Shuffler = module.exports.Shuffler = function(list) {
  this.list = list;
  this.indices = [];
};

Shuffler.prototype.next = function() {
  if (this.indices.length === 0) {
    this.indices = _.shuffle(_.range(this.list.length));
  }
  return this.list[this.indices.pop()];
};
