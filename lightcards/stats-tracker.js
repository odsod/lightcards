var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter;

var StatsTracker = exports.StatsTracker = function(options) {
  this._eventEmitter = new EventEmitter();
  this._cards = options.cards;
  this._learnedCards = [];
  this._cardsSeen = 0;
  this._correctAnswers = 0;
  this._incorrectAnswers = 0;
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

StatsTracker.prototype._updateStats = function() {
  this._eventEmitter.emit('stats', this.getStats());
};

StatsTracker.prototype.logNextCard = function(card) {
  this._hasAnsweredCurrentCard = false;
};

StatsTracker.prototype.logCorrectAnswerFor = function(card) {
  this._hasAnsweredCurrentCard = true;
  this._learnedCards = _(this._learnedCards.concat(card)).unique();
  this._correctAnswers += 1;
  this._lastIncorrectlyAnswered = null;
  this._updateStats();
};

StatsTracker.prototype.logIncorrectAnswerFor = function(card) {
  this._hasAnsweredCurrentCard = true;
  this._learnedCards = _(this._learnedCards).without(card);
  this._incorrectAnswers += 1;
  this._updateStats();
};

StatsTracker.prototype.logShowHintFor = function(card) {
  this._learnedCards = _(this._learnedCards).without(card);
};

StatsTracker.prototype.logShowAnswerFor = function(card) {
  this._learnedCards = _(this._learnedCards).without(card);
};

StatsTracker.prototype._hasAnsweredCurrentCard = function() {
  return this._hasAnsweredCurrentCard;
};

StatsTracker.prototype.addEventListener = function(type, handler) {
  this._eventEmitter.on(type, handler);
};
