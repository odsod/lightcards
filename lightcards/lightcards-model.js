var _ = require('underscore'),
    ko = require('knockout'),
    Shuffler = require('./shuffler.js').Shuffler,
    pinyin = require('../pinyin.js');

var LightcardsModel = exports.LightcardsModel = function(flashcards) {
  var self = this;
  this.learnedFlashcards = new Shuffler([]);
  this.notLearnedFlashcards = new Shuffler(flashcards);
  this.currentFlashcard = ko.observable(this.notLearnedFlashcards.next());
  this.amountLearned = ko.computed(function() {
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
    this.markLearned(this.currentFlashcard());
    this.nextCard();
  } else {
    this.markNotLearned(this.currentFlashcard());
  }
};

LightcardsModel.prototype.nextCard = function() {
  var stacks = _.shuffle([this.learnedFlashcards, this.notLearnedFlashcards]);
  this.currentCard(stacks[0].next() || stacks[1].next());
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
