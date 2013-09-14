(function(ko, _) {

  var Shuffler = function(list) {
    this.list = list;
    this.indices = [];
  };

  Shuffler.prototype.next = function() {
    if (this.indices.length === 0) {
      this.indices = _.shuffle(_.range(this.list.length));
    }
    return this.list[this.indices.pop()];
  };

  var normalize = function(input) {
    return input.replace(/5| /g, '');
  };

  var inputIsEqual = function(lhs, rhs) {
    return normalize(lhs) === normalize(rhs);
  };

  var LightcardsViewModel = function(vocabulary) {
    var self = this;

    this.input = ko.observable('');
    this.showTranslation = ko.observable(false);
    this.animationToggle = ko.observable(true);

    this.vocabulary = new Shuffler(vocabulary);
    this.currentWord = ko.observable(this.vocabulary.next());

    this.character = ko.computed(function() { return self.currentWord().character; });
    this.pinyin = ko.computed(function() { return self.currentWord().pinyin; });

    this.translation = ko.computed(function() {
      var translations = self.currentWord().translations,
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
    var self = this;
    this.reset();
    this.animationToggle(false);
    setTimeout(function() {
      self.animationToggle(true);
      self.currentWord(self.vocabulary.next());
    }, 1);
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

}(window.ko, window._));
