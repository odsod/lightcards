var ko = require('knockout'),
    boxes = require('./globals.js').boxes,
    config = require('./globals.js').config,
    equalsPinyin = require('./pinyin.js').equalsPinyin,
    LeitnerSystem = require('./leitner-system.js').LeitnerSystem;

var find = require('mout/array/find'),
    findIndex = require('mout/array/findIndex'),
    zip = require('mout/array/zip'),
    deepEquals = require('mout/object/deepEquals');

console.log(boxes);
console.log(config);

var m = {};

m.leitnerSystem = new LeitnerSystem({
  boxes: boxes,
  cardsPerBatch: config.cardsPerBatch
});

console.log(m.leitnerSystem.toSerializedForm());

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
  var cardIsFromFirstBox = m.leitnerSystem.boxIndexOf(m.currentCard) === 0,
      cardIsFromSecondBox = m.leitnerSystem.boxIndexOf(m.currentCard) === 1,
      neededOnlyTranslationHint = m.hasUsedTranslationHintForCurrentCard &&
                                  !m.hasUsedPlaceholderHintForCurrentCard,
      answeredPerfectly = !m.hasAnsweredCurrentCardIncorrectly &&
                          !m.hasUsedHintForCurrentCard;

  if (answeredPerfectly ||
      cardIsFromFirstBox ||
      cardIsFromSecondBox && !m.hasUsedHintForCurrentCard) {
    m.leitnerSystem.promote(m.currentCard);
  } else if (!m.hasAnsweredTranslationCorrectly) {
    m.leitnerSystem.demote(m.currentCard);
  }
  m.hasAnsweredCurrentCardIncorrectly = false;
  m.hasAnsweredTranslationCorrectly = false;
  m.hasUsedHintForCurrentCard = false;
  m.hasUsedTranslationHintForCurrentCard = false;
  m.hasUsedPlaceholderHintForCurrentCard = false;
  m.currentCard = m.leitnerSystem.next();
  m.saveState();
  console.log(m.leitnerSystem.toSerializedForm());
  return m.currentCard;
};

var vm = {};

vm.currentCard = ko.observable(m.currentCard);

vm.input = ko.observable('');

vm.hanzi = ko.computed(function() {
  return vm.currentCard().hanzi;
});

vm.placeholder = ko.computed(function() {
  return vm.currentCard().pinyin;
});

vm.translation = ko.computed(function() {
  return vm.currentCard().translation;
});

vm.hanziStuff = ko.computed(function() {
  var card = vm.currentCard();
  return zip(card.hanzi.split(''), card.pinyin.split(' ')).map(function(zipped) {
    var pinyinParts = /(\D+)(\d?)/.exec(zipped[1]);
    return {
      hanzi: zipped[0],
      pinyin: {
        text: pinyinParts[1],
        tone: pinyinParts[2],
        textStyle: ko.observable('hide'),
        toneStyle: ko.observable('hide')
      }
    };
  });
});

vm.revealAllCorrectStuff = function(input) {
  var hanziStuff = vm.hanziStuff();
  zip(vm.hanziStuff(), input.split(' ')).forEach(function(zipped) {
    var stuff = zipped[0],
        pinyinParts = /(\D+)(\d?)/.exec(zipped[1]),
        pinyinText = pinyinParts[1],
        pinyinTone = pinyinParts[2];
    if (pinyinText === stuff.pinyin.text ||
        pinyinTone === stuff.pinyin.tone) {
      if (pinyinText === stuff.pinyin.text) {
        stuff.pinyin.textStyle('show');
      } else {
        stuff.pinyin.textStyle('underline');
      }
      if (pinyinTone === stuff.pinyin.tone) {
        stuff.pinyin.toneStyle('show');
      } else {
        stuff.pinyin.toneStyle('underline');
      }
    }
  });
};

vm.hanziStuff.subscribe(function(stuff) {
  console.log(stuff);
});

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
    vm.currentCard(card);
  });
};

vm.requestHintIfKeyIsDownArrow = function(_, e) {
  if (e.keyCode === 40) {
    m.hasUsedHintForCurrentCard = true;
    if (!vm.isShowingTranslation()) {
      vm.isShowingTranslation(true);
      m.hasUsedTranslationHintForCurrentCard = true;
    } else {
      m.hasUsedPlaceholderHintForCurrentCard = true;
      vm.isShowingPlaceholder(true);
      vm.input('');
    }
  }
};

vm.checkIfInputIsCorrect = function() {
  vm.revealAllCorrectStuff(vm.input());
  if (equalsPinyin(m.currentCard.pinyin, vm.input())) {
    vm.setCurrentCard(m.nextCard());
  } else if (m.currentCard.translation === vm.input()) {
    vm.isShowingTranslation(true);
    m.hasAnsweredTranslationCorrectly = true;
  } else {
    m.hasAnsweredCurrentCardIncorrectly = true;
  }
  vm.input('');
};

vm.restoreFocus = function(_, e) {
  setTimeout(function() { e.target.focus(); }, 0);
};

ko.applyBindings(vm);
