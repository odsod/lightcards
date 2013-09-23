var ko = require('knockout'),
    _ = require('underscore'),
    Shuffler = require('./shuffler').Shuffler;

var LightCardsViewModel = exports.LightCardsViewModel = function(cards) {
  var self = this;

  this.cards = cards;
  this.shuffledCards = new Shuffler(cards);
  this.currentCard = ko.observable(this.shuffledCards.next());
  this.learnedCards = ko.observableArray();
  this.userHasAnsweredIncorrectly = ko.observable();

  this.learnedRate = ko.computed(function() {
    return Math.round(self.learnedCards().length / self.cards.length * 100);
  });

  this.input = ko.observable('');
  this.showTranslation = ko.observable(false);
  this.animationToggle = ko.observable(true);

  this.handlers = {
    keyup: function(_, e) {
      if (e.keyCode === 13) { this.checkAnswer(this.input());
      } else if (e.keyCode === 40) { self.showHelp(); }
    },
    blur: function(_, e) { setTimeout(function() { e.target.focus(); }, 1); }
  };
};

LightCardsViewModel.prototype.reset = function() {
  this.showTranslation(false);
  this.input(null);
  this.userHasAnsweredIncorrectly(false);
};

LightCardsViewModel.prototype.normalizeAnswer = function(answer) {
  return answer
    .replace(/5/g, '')
    .replace(/\s+/g, '')
    .replace(/u:/g, 'v')
    .toLowerCase();
};

LightCardsViewModel.prototype.markLearned = function(card) {
  this.learnedCards.push(card);
  this.learnedCards(_.unique(this.learnedCards()));
};

LightCardsViewModel.prototype.markNotLearned = function(card) {
  this.learnedCards.remove(card);
};

LightCardsViewModel.prototype.nextCard = function() {
  var self = this;
  this.reset();
  this.animationToggle(false);
  setTimeout(function() {
    self.animationToggle(true);
    self.currentCard(self.shuffledCards.next());
  }, 1);
};

LightCardsViewModel.prototype.checkAnswer = function(answer) {
  var isCorrect = this.normalizeAnswer(answer) ===
                  this.normalizeAnswer(this.currentCard().transcription);
  if (isCorrect) {
    if (!this.userHasAnsweredIncorrectly()) {
      this.markLearned(this.currentCard());
    }
    this.nextCard();
  } else {
    this.markNotLearned(this.currentCard());
    this.userHasAnsweredIncorrectly(true);
  }
};

LightCardsViewModel.prototype.showHelp = function() {
  this.userHasAnsweredIncorrectly(true);
  this.markNotLearned(this.currentCard());
  if (!this.showTranslation()) { this.showTranslation(true);
  } else { this.input(this.currentCard().transcription); }
};
