var normalize = function(input) {
  return input.replace(/5| /g, '');
};

var inputIsEqual = function(lhs, rhs) {
  return normalize(lhs) === normalize(rhs);
};

(function(ko, vocabulary) {
  var vm = {};

  vm.currentWord = ko.observable();

  var currentWordIndex = 0;

  vm.input = ko.observable();

  vm.inputBlur = function(_, e) {
    setTimeout(function() { e.target.focus(); }, 1);
  };

  vm.translation = ko.computed(function() {
    if (!vm.currentWord()) { return; }
    var allTranslations = vm.currentWord().translations,
        selectedTranslations = [];
    for (var i = 0, totalLength = 0; i < allTranslations.length && totalLength < 100; ++i) {
      selectedTranslations.push(allTranslations[i]);
      totalLength += allTranslations[i].length;
    }
    return selectedTranslations.join(' - ');
  });

  vm.showTranslation = ko.observable();

  vm.currentWord(vocabulary[0]);

  ko.applyBindings(vm);

  var nextWord = function() {
    currentWordIndex = (currentWordIndex + 1) % vocabulary.length;
    vm.currentWord(vocabulary[currentWordIndex]);
    vm.showTranslation(false);
    vm.input(null);
  };

  var checkInput = function() {
    if (inputIsEqual(vm.input(), vm.currentWord().pinyin)) { nextWord(); }
  };

  var revealNext = function() {
    if (!vm.showTranslation()) {
      vm.showTranslation(true);
    } else {
      vm.input(vm.currentWord().pinyin);
    }
  };

  window.onkeyup = function(e) {
    if (e.keyCode === 40) { revealNext(); }
    else if (e.keyCode === 13) { checkInput(); }
  };

}(window.ko, window.vocabulary));
