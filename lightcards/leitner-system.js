var _ = require('underscore'),
    ShuffleBox = require('./shuffle-box.js').ShuffleBox;

var LeitnerSystem = exports.LeitnerSystem = function(options) {
  this.cards = options.cards;
  this.boxes = [];
  this.bufferSize = this.cards.length;
  this.frequencies = options.frequencies;
  this.cardBuffer = [];
  this.boxes = _(this.frequencies.length).range().map(function() {
    return new ShuffleBox();
  });
  this.boxes[0].add(options.cards);
  this.log();
};

LeitnerSystem.prototype.log = function() {
  console.log('Boxes:', _(this.boxes).invoke('size'));
  console.log('Cards:', this.cardBuffer.length);
};

LeitnerSystem.prototype.next = function() {
  var self = this;
  if (_(this.cardBuffer).isEmpty()) {
    this.boxes.forEach(function(box, i) {
      var amountFromThisBox = Math.ceil(self.bufferSize * self.frequencies[i]);
      self.cardBuffer = self.cardBuffer.concat(box.next(amountFromThisBox));
    });
  }
  return this.cardBuffer.pop();
};

LeitnerSystem.prototype.promote = function(card) {
  var currentBox = _(this.boxes).find(function(box) {
    return box.contains(card);
  });
  currentBox.remove(card);
  var nextBox = this.boxes[Math.min(this.boxes.length - 1, this.boxes.indexOf(currentBox) + 1)];
  nextBox.add(card);
  this.log();
};

LeitnerSystem.prototype.demote = function(card) {
  var currentBox = _(this.boxes).find(function(box) {
    return box.contains(card);
  });
  currentBox.remove(card);
  var nextBox = this.boxes[Math.max(0, this.boxes.indexOf(currentBox) - 1)];
  nextBox.add(card);
  this.log();
};
