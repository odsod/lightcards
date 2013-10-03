var ko = require('knockout'),
    globals = require('./globals.js'),
    StatsTracker = require('./stats-tracker.js').StatsTracker,
    pinyin = require('../pinyin.js'),
    LeitnerSystem = require('./leitner-system.js').LeitnerSystem,
    LightcardsViewModel = require('./lightcards-view-model').LightCardsViewModel;


var isAnswerCorrect = function(card, answer) {
  return pinyin.normalize(answer) ===
         pinyin.normalize(card.pinyin);
};

var leitnerSystem = new LeitnerSystem({
  cards: globals.cards,
  frequencies: [0.55, 0.20, 0.15, 0.10]
});

var statsTracker = new StatsTracker({
  cards: globals.cards
});

var currentCard = leitnerSystem.nextCard();

var viewModel = new LightcardsViewModel({
  hasAudio: globals.hasAudio
});

viewModel
  .stats(statsTracker.getStats())
  .currentCard(currentCard);

viewModel.addEventListener('showhelp:hint', function(card) {
  statsTracker.logShowHintFor(card);
});

viewModel.addEventListener('showhelp:answer', function(card) {
  statsTracker.logShowAnswerFor(card);
});

viewModel.addEventListener('input:submit', function(input) {
  var answerIsCorrect = isAnswerCorrect(currentCard, input);
  if (answerIsCorrect &&
      !statsTracker.hasUsedHint() &&
      !statsTracker.hasAnsweredIncorrectly()) {
    leitnerSystem.promote(currentCard);
  } else if (!answerIsCorrect && !statsTracker.hasAnsweredIncorrectly()) {
    leitnerSystem.demote(currentCard);
  }
  if (isAnswerCorrect(currentCard, input)) {
    statsTracker.logCorrectAnswerFor(currentCard);
    currentCard = leitnerSystem.nextCard();
    viewModel.setCurrentCard(currentCard);
  } else {
    statsTracker.logIncorrectAnswerFor(currentCard);
  }
});

statsTracker.addEventListener('stats', function(stats) {
  viewModel.stats(stats);
});

ko.applyBindings(viewModel);
