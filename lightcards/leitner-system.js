var contains = require('mout/array/contains'),
    find = require('mout/array/find'),
    remove = require('mout/array/remove'),
    shuffle = require('mout/array/shuffle');

/* Shuffling */

var decorateWithShuffling = function(arr) {
  arr = arr.slice();
  arr._shuffledItems = [];
  return arr;
};

var takeShuffledItems = function(arr, n) {
  if (arr._shuffledItems.length < n) {
    arr._shuffledItems = shuffle(arr);
  }
  return arr._shuffledItems.splice(0, n);
};

var removeShuffledItem = function(arr, item) {
  remove(arr._shuffledItems, item);
  remove(arr, item);
};

/* Leitner system */

var LeitnerSystem = exports.LeitnerSystem = function(options) {
  this._boxes = options.boxes.map(decorateWithShuffling);
  this._frequencies = options.frequencies;
  this._batchSize = options.batchSize;
  this._currentBatch = [];
};

LeitnerSystem.prototype._log = function() {
  console.log('Boxes:', this._boxes.map(function(box) {
    return box.length;
  }));
  console.log('Current batch:', this._currentBatch.length);
};

LeitnerSystem.prototype._getNewBatch = function() {
  var batch = [];
  for (var i = 0, len = this._boxes.length; i < len; ++i) {
    var amountFromThisBox = Math.round(this._batchSize * this._frequencies[i]),
        itemsFromThisBox = takeShuffledItems(this._boxes[i], amountFromThisBox);
    batch.push.apply(batch, itemsFromThisBox);
  }
  return batch;
};

LeitnerSystem.prototype.next = function() {
  if (this._currentBatch.length === 0) {
    this._currentBatch = this._getNewBatch();
  }
  return this._currentBatch.pop();
};

LeitnerSystem.prototype.move = function(item, delta) {
  var currentBox = find(this._boxes, function(box) {
    return contains(box, item);
  });
  removeShuffledItem(currentBox, item);

  var nextBoxIndex = this._boxes.indexOf(currentBox) + delta;
  nextBoxIndex = Math.min(this._boxes.length - 1, Math.max(0, nextBoxIndex));
  this._boxes[nextBoxIndex].push(item);
};

LeitnerSystem.prototype.promote = function(item) {
  this.move(item, 1);
};

LeitnerSystem.prototype.demote = function(item) {
  this.move(item, -1);
};
