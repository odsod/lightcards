var ko = require('knockout'),
    cards = require('./globals.js').cards,
    boxes = require('./globals.js').boxes,
    equalsPinyin = require('./pinyin.js').equalsPinyin,
    LeitnerSystem = require('./leitner-system.js').LeitnerSystem;

console.log(boxes);

var m = {};

m.leitnerSystem = new LeitnerSystem({
  boxes: [cards, [], [], []],
  frequencies: [0.55, 0.20, 0.15, 0.10],
  batchSize: 20
});

m.currentCard = m.leitnerSystem.next();
m.hasUsedHintForCurrentCard = false;
m.hasAnsweredCurrentCardIncorrectly = false;

m.saveState = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/save', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(m.leitnerSystem.toSerializedForm()));
};

m.nextCard = function() {
  if (!m.hasAnsweredCurrentCardIncorrectly &&
      !m.hasUsedHintForCurrentCard) {
    m.leitnerSystem.promote(m.currentCard);
  } else {
    m.leitnerSystem.demote(m.currentCard);
  }
  m.hasAnsweredCurrentCardIncorrectly = false;
  m.hasUsedHintForCurrentCard = false;
  m.currentCard = m.leitnerSystem.next();
  m.saveState();
  return m.currentCard;
};

var vm = {};

vm.input = ko.observable('');

vm.hanzi = ko.observable(m.currentCard.hanzi);
vm.placeholder = ko.observable(m.currentCard.pinyin);
vm.translation = ko.observable(m.currentCard.translation);

vm.isShowingPlaceholder = ko.observable(false);
vm.isShowingTranslation = ko.observable(false);

vm.animationToggle = ko.observable(false);

vm.afterAnimationStarted = function(callback) {
  vm.animationToggle(true);
  setTimeout(function() {
    vm.animationToggle(false);
    callback();
  }, 0);
};

vm.setCurrentCard = function(card) {
  vm.isShowingPlaceholder(false);
  vm.isShowingTranslation(false);
  vm.afterAnimationStarted(function() {
    vm.hanzi(card.hanzi);
    vm.translation(card.translation);
    vm.placeholder(card.pinyin);
  });
};

vm.requestHintIfKeyIsDownArrow = function(_, e) {
  if (e.keyCode === 40) {
    m.hasUsedHintForCurrentCard = true;
    if (!vm.isShowingTranslation()) {
      vm.isShowingTranslation(true);
    } else {
      vm.isShowingPlaceholder(true);
      vm.input('');
    }
  }
};

vm.checkIfInputIsCorrect = function() {
  if (equalsPinyin(m.currentCard.pinyin, vm.input())) {
    vm.setCurrentCard(m.nextCard());
  } else {
    m.hasAnsweredCurrentCardIncorrectly = true;
  }
  vm.input('');
};

vm.restoreFocus = function(_, e) {
  setTimeout(function() { e.target.focus(); }, 0);
};

ko.applyBindings(vm);
