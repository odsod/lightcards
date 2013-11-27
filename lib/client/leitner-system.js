var contains = require('mout/array/contains'),
    find = require('mout/array/find'),
    findIndex = require('mout/array/findIndex'),
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
  this._cardsPerBatch = options.cardsPerBatch;
  this._currentBatch = [];
};

LeitnerSystem.prototype.toString = function() {
  return [
    'Boxes: ' + this._boxes.map(function(box) { return box.length; })
  ].join('\n');
};

LeitnerSystem.prototype._getNewBatch = function() {
  var batch = [];
  for (var i = 0, len = this._boxes.length; i < len; ++i) {
    var itemsFromThisBox = takeShuffledItems(this._boxes[i], this._cardsPerBatch[i]);
    batch.push.apply(batch, itemsFromThisBox);
  }
  return shuffle(batch);
};

LeitnerSystem.prototype.next = function() {
  if (this._currentBatch.length === 0) {
    this._currentBatch = this._getNewBatch();
  }
  return this._currentBatch.pop();
};

LeitnerSystem.prototype.boxIndexOf = function(item) {
  return findIndex(this._boxes, function(box) {
    return contains(box, item);
  });
};

LeitnerSystem.prototype.move = function(item, delta) {
  var currentBoxIndex = findIndex(this._boxes, function(box) {
    return contains(box, item);
  });

  var nextBoxIndex = currentBoxIndex + delta;
  nextBoxIndex = Math.min(this._boxes.length - 1, Math.max(0, nextBoxIndex));

  console.log('Moving', item, 'from box', currentBoxIndex, 'to box', nextBoxIndex);

  removeShuffledItem(this._boxes[currentBoxIndex], item);
  this._boxes[nextBoxIndex].push(item);
};

LeitnerSystem.prototype.promote = function(item) {
  this.move(item, 1);
};

LeitnerSystem.prototype.demote = function(item) {
  this.move(item, -1);
};

LeitnerSystem.prototype.toSerializedForm = function(item) {
  return this._boxes.map(function(box) {
    return box.slice();
  });
};
