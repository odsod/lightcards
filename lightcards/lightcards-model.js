var _ = require('underscore'),
    ko = require('knockout'),
    LeitnerSystem = require('./leitner-system.js').LeitnerSystem,
    pinyin = require('../pinyin.js');

var LightcardsModel = exports.LightcardsModel = function(flashcards) {
  var self = this;
  this.flashcards = flashcards;
  this.cards = new LeitnerSystem({
    cards: flashcards,
    frequencies: [0.55, 0.20, 0.15, 0.10]
  });
  this.currentFlashcard = ko.observable(this.cards.next());
  this.amountLearned = ko.computed(function() {
    return 0;
  });
  this.percentageLearned = ko.computed(function() {
    return 0;
  });
  this.hasMarkedNotLearned = false;
};

LightcardsModel.prototype.checkAnswer = function(answer) {
  var isCorrect = pinyin.normalize(answer) === pinyin.normalize(this.currentFlashcard().pinyin);
  if (isCorrect) {
    if (!this.hasMarkedNotLearned) {
      this.cards.promote(this.currentFlashcard());
    }
    this.nextCard();
  } else {
    this.cards.demote(this.currentFlashcard());
    this.hasMarkedNotLearned = true;
  }
};

LightcardsModel.prototype.markNotLearned = function(card) {
  this.cards.demote(card);
  this.hasMarkedNotLearned = true;
};

LightcardsModel.prototype.nextCard = function() {
  this.currentFlashcard(this.cards.next());
  this.hasMarkedNotLearned = false;
};
