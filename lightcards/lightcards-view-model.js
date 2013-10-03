var ko = require('knockout'),
    _ = require('underscore'),
    pinyin = require('../pinyin.js');

var LightCardsViewModel = exports.LightCardsViewModel = function(model, options) {
  var self = this;

  this.model = model;
  this.hasAudio = options.hasAudio;
  this.currentFlashcard = ko.computed(model.currentFlashcard);
  this.amountLearned = ko.computed(model.amountLearned);
  this.percentageLearned = ko.computed(model.percentageLearned);

  this.input = ko.observable('');
  this.showTranslation = ko.observable(false);
  this.showTranscription = ko.observable(false);
  this.animationToggle = ko.observable(true);

  this.currentFlashcard.subscribe(function() { self.nextCard(); });

  this.handlers = {
    blur: function(_, e) { setTimeout(function() { e.target.focus(); }, 1); },
    click: function(_, e) {
      if (self.hasAudio) {
        var hanzi = ko.dataFor(e.target);
        var pinyin = self.currentFlashcard().pinyin.split(/\s/);
        var index = self.currentFlashcard().hanzi.indexOf(hanzi);
        var key = pinyin[index].toLowerCase();
        console.log(key);
        new Audio('audio/' + key + '.mp3').play();
      }
    },
    keyup: function(_, e) {
      if (e.keyCode === 13) { this.model.checkAnswer(this.input());
      } else if (e.keyCode === 40) { self.showHelp(); }
    }
  };
};

LightCardsViewModel.prototype.nextCard = function() {
  var self = this;
  this.showTranslation(false);
  this.showTranscription(false);
  this.input(null);
  this.animationToggle(false);
  setTimeout(function() {
    self.animationToggle(true);
  }, 1);
};

LightCardsViewModel.prototype.checkAnswer = function(answer) {
  this.model.checkAnswer(answer);
};

LightCardsViewModel.prototype.showHelp = function() {
  this.model.markNotLearned(this.currentFlashcard());
  if (!this.showTranslation()) {
    this.showTranslation(true);
  } else {
    this.showTranscription(true);
    this.input('');
  }
};
