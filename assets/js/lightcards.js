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

  var LightcardsViewModel = function(cards) {
    var self = this;

    this.cards = cards;
    this.shuffledCards = new Shuffler(cards);
    this.currentCard = ko.observable(this.shuffledCards.next());
    this.learnedCards = ko.observableArray();

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

  LightcardsViewModel.prototype.reset = function() {
    this.showTranslation(false);
    this.input(null);
  };

  LightcardsViewModel.prototype.normalizeAnswer = function(answer) {
    return answer.replace(/5| /g, '');
  };

  LightcardsViewModel.prototype.markLearned = function(card) {
    this.learnedCards.push(card);
    this.learnedCards(_.unique(this.learnedCards()));
  };

  LightcardsViewModel.prototype.markNotLearned = function(card) {
    this.learnedCards.remove(card);
  };

  LightcardsViewModel.prototype.nextCard = function() {
    var self = this;
    this.reset();
    this.animationToggle(false);
    setTimeout(function() {
      self.animationToggle(true);
      self.currentCard(self.shuffledCards.next());
    }, 1);
  };

  LightcardsViewModel.prototype.checkAnswer = function(answer) {
    var isCorrect = this.normalizeAnswer(answer) ===
                    this.normalizeAnswer(this.currentCard().transcription);
    if (isCorrect) {
      this.markLearned(this.currentCard());
      this.nextCard();
    } else {
      this.markNotLearned(this.currentCard());
    }
  };

  LightcardsViewModel.prototype.showHelp = function() {
    this.markNotLearned(this.currentCard());
    if (!this.showTranslation()) { this.showTranslation(true);
    } else { this.input(this.transcription()); }
  };

  var viewModel = new LightcardsViewModel(window.cards);

  ko.applyBindings(viewModel);

}(window.ko, window._));
