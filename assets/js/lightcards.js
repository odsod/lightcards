(function(ko) {

  var normalize = function(input) {
    return input.replace(/5| /g, '');
  };

  var inputIsEqual = function(lhs, rhs) {
    return normalize(lhs) === normalize(rhs);
  };

  var LightcardsViewModel = function(vocabulary) {
    var self = this;

    this.vocabulary = vocabulary;

    this.currentWordIndex = ko.observable(0);
    this.input = ko.observable('');
    this.showTranslation = ko.observable(false);

    this.character = ko.computed(function() {
      return vocabulary[self.currentWordIndex()].character;
    });

    this.pinyin = ko.computed(function() {
      return vocabulary[self.currentWordIndex()].pinyin;
    });

    this.translation = ko.computed(function() {
      var translations = vocabulary[self.currentWordIndex()].translations,
          selectedTranslations = [];
      for (var i = 0, totalLength = 0; i < translations.length && totalLength < 100; ++i) {
        selectedTranslations.push(translations[i]);
        totalLength += translations[i].length;
      }
      return selectedTranslations.join(' - ');
    });

    this.handlers = {
      blur: function(_, e) { setTimeout(function() { e.target.focus(); }, 1); },
      keyup: function(_, e) {
        if (e.keyCode === 13) { self.checkInput(); }
        else if (e.keyCode === 40) { self.revealNext(); }
      }
    };
  };

  LightcardsViewModel.prototype.checkInput = function() {
    if (inputIsEqual(this.input(), this.pinyin())) { this.nextWord(); }
  };

  LightcardsViewModel.prototype.reset = function() {
    this.showTranslation(false);
    this.input(null);
  };

  LightcardsViewModel.prototype.nextWord = function() {
    this.currentWordIndex(this.currentWordIndex() + 1 % this.vocabulary.length);
    this.reset();
  };

  LightcardsViewModel.prototype.revealNext = function() {
    if (!this.showTranslation()) {
      this.showTranslation(true);
    } else {
      this.input(this.pinyin());
    }
  };

  var viewModel = new LightcardsViewModel(window.vocabulary);

  ko.applyBindings(viewModel);

}(window.ko));
