var _ = require('underscore'),
    ko = require('knockout'),
    Shuffler = require('./shuffler.js').Shuffler,
    pinyin = require('../pinyin.js');

var LightcardsModel = exports.LightcardsModel = function(flashcards) {
  var self = this;
  this.flashcards = flashcards;
  this.learnedFlashcards = new Shuffler([]);
  this.notLearnedFlashcards = new Shuffler(flashcards);
  this.currentFlashcard = ko.observable(this.notLearnedFlashcards.next());
  this.amountLearned = ko.computed(function() {
    self.currentFlashcard();
    return self.learnedFlashcards.length();
  });
  this.percentageLearned = ko.computed(function() {
    self.currentFlashcard();
    return Math.floor(self.learnedFlashcards.length() / flashcards.length);
  });
  this.hasMarkedNotLearned = false;
};

LightcardsModel.prototype.checkAnswer = function(answer) {
  var isCorrect = pinyin.normalize(answer) === pinyin.normalize(this.currentFlashcard().pinyin);
  if (isCorrect) {
    if (!this.hasMarkedNotLearned) {
      this.markLearned(this.currentFlashcard());
    }
    this.nextCard();
  } else {
    this.markNotLearned(this.currentFlashcard());
  }
};

LightcardsModel.prototype.nextCard = function() {
  var chanceToPickNotLearned = Math.max(0.25, this.notLearnedFlashcards.length() / this.flashcards.length);
  var nextCard;
  if (Math.random() < chanceToPickNotLearned) {
    nextCard = this.notLearnedFlashcards.next();
  }
  nextCard = nextCard || this.learnedFlashcards.next();
  this.currentFlashcard(nextCard);
  this.hasMarkedNotLearned = false;
};

LightcardsModel.prototype.markNotLearned = function(flashcard) {
  this.learnedFlashcards.remove(flashcard);
  this.notLearnedFlashcards.add(flashcard);
  this.hasMarkedNotLearned = true;
};

LightcardsModel.prototype.markLearned = function(flashcard) {
  this.notLearnedFlashcards.remove(flashcard);
  this.learnedFlashcards.add(flashcard);
};
