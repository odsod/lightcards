var ko = require('knockout'),
    EventEmitter = require('events').EventEmitter;

var LightCardsViewModel = exports.LightCardsViewModel = function(options) {
  var self = this;
  this._eventEmitter = new EventEmitter();

  this._enableAudio = options.hasAudio;

  this.currentCard = ko.observable();
  this.stats = ko.observable();

  this.input = ko.observable('');
  this.showTranslation = ko.observable(false);
  this.showTranscription = ko.observable(false);
  this.animationToggle = ko.observable(true);

  this.handlers = {
    blur: function(_, e) { setTimeout(function() { e.target.focus(); }, 1); },
    click: function(_, e) {
      if (self._enableAudio) {
        var hanzi = ko.dataFor(e.target);
        var pinyin = self.currentCard().pinyin.split(/\s/);
        var index = self.currentCard().hanzi.indexOf(hanzi);
        var key = pinyin[index].toLowerCase();
        console.log(key);
        new Audio('audio/' + key + '.mp3').play();
      }
    },
    keyup: function(_, e) {
      if (e.keyCode === 13) {
        self._eventEmitter.emit('input:submit', self.input());
      } else if (e.keyCode === 40) {
        self.showNextHelp();
      }
    }
  };
};

LightCardsViewModel.prototype._animateNextCard = function(card) {
  var self = this;
  this.showTranslation(false);
  this.showTranscription(false);
  this.input(null);
  this.animationToggle(false);
  setTimeout(function() {
    self.currentCard(card);
    self.animationToggle(true);
  }, 1);
};

LightCardsViewModel.prototype.showNextHelp = function() {
  if (!this.showTranslation()) {
    this._eventEmitter.emit('showhelp:hint');
    this.showTranslation(true);
  } else {
    this._eventEmitter.emit('showhelp:answer');
    this.showTranscription(true);
    this.input('');
  }
};

LightCardsViewModel.prototype.addEventListener = function(type, handler) {
  this._eventEmitter.on(type, handler);
};

LightCardsViewModel.prototype.setCurrentCard = function(card) {
  this._animateNextCard(card);
};
