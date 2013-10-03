var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter;

var StatsTracker = exports.StatsTracker = function(options) {
  this._eventEmitter = new EventEmitter();
  this._cards = options.cards;
  this._learnedCards = [];
  this._cardsSeen = 0;
  this._correctAnswers = 0;
  this._incorrectAnswers = 0;
  this._hasUsedHint = false;
  this._hasAnsweredIncorrectly = false;
};

StatsTracker.prototype._calcPercentageLearned = function(card) {
  return Math.floor(this._learnedCards.length / this._cards.length);
};

StatsTracker.prototype._calcAmountLearned = function(card) {
  return this._learnedCards.length;
};

StatsTracker.prototype.getStats = function() {
  return {
    percentageLearned: this._calcPercentageLearned(),
    amountLearned: this._calcAmountLearned()
  };
};

StatsTracker.prototype._notifyStats = function() {
  this._eventEmitter.emit('stats', this.getStats());
};

StatsTracker.prototype.logNextCard = function(card) {
  this._hasAnsweredIncorrectly = false;
  this._hasUsedHint = false;
};

StatsTracker.prototype.logCorrectAnswerFor = function(card) {
  this._learnedCards = _(this._learnedCards.concat(card)).unique();
  if (!this._hasAnsweredIncorrectly) {
    this._correctAnswers += 1;
    this._notifyStats();
  }
};

StatsTracker.prototype.logIncorrectAnswerFor = function(card) {
  this._hasAnsweredIncorrectly = true;
  this._learnedCards = _(this._learnedCards).without(card);
  this._incorrectAnswers += 1;
};

StatsTracker.prototype.hasAnsweredIncorrectly = function() {
  return this._hasAnsweredIncorrectly;
};

StatsTracker.prototype.hasUsedHint = function() {
  return this._hasUsedHint;
};

StatsTracker.prototype.logShowHintFor = function(card) {
  this._hasUsedHint = true;
  this._learnedCards = _(this._learnedCards).without(card);
};

StatsTracker.prototype.logShowAnswerFor = function(card) {
  this._hasUsedHint = true;
  this._learnedCards = _(this._learnedCards).without(card);
};

StatsTracker.prototype.addEventListener = function(type, handler) {
  this._eventEmitter.on(type, handler);
};
