var fs = require('fs'),
    path = require('path'),
    browserify = require('browserify');

var findIndex = require('mout/array/findIndex'),
    mixin = require('mout/object/mixin'),
    deepEquals = require('mout/object/deepEquals');

var generateConfig = function(userConfigFile) {
  var config = fs.readFileSync(path.join(__dirname, 'config.json'));
  if (fs.existsSync(userConfigFile)) {
    mixin(config, JSON.parse(fs.readFileSync(userConfigFile, 'utf-8')));
  }
  return config;
};

var generateCards = function(vocabularyFile) {
  var vocabulary = fs.readFileSync(vocabularyFile, 'utf-8');
  return vocabulary.trim().split('\n').map(function(row) {
    return row.trim().split('\t').map(function(entry) {
      return entry.trim();
    });
  }).filter(function(row) {
    return row.length === 3 &&
           row[0] && row[1] && row[2];
  }).map(function(row) {
    return {
      hanzi: row[0],
      pinyin: row[1],
      translation: row[2]
    };
  });
};

var generateBoxes = function(stateFile, cards, config) {
  var newBoxes = config.cardsPerSession.map(function() {
    return [];
  });

  var savedBoxes;
  if (fs.existsSync(stateFile)) {
    savedBoxes = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
  } else {
    savedBoxes = [];
  }

  cards.forEach(function(card) {
    var indexOfCardAmongSavedBoxes = findIndex(savedBoxes, function(box) {
      return -1 !== findIndex(box, function(cardInBox) {
        return deepEquals(card, cardInBox);
      });
    });

    var cardExistsAmongSavedBoxes = indexOfCardAmongSavedBoxes !== -1,
        savedBoxExistsAmongNewBoxes = indexOfCardAmongSavedBoxes < savedBoxes.length;

    if (cardExistsAmongSavedBoxes && savedBoxExistsAmongNewBoxes) {
      newBoxes[indexOfCardAmongSavedBoxes].push(card);
    } else {
      newBoxes[0].push(card);
    }
  });

  return newBoxes;
};

exports.compileScriptBundle = function(options, callback) {
  var cards = generateCards(options.vocabularyFile);
  var config = generateConfig(options.userConfigFile);
  var boxes = generateBoxes(options.stateFile, cards, config);
  browserify('../client').bundle({
    insertGlobalVars: {
      boxes: function() { return JSON.stringify(boxes); },
      config: function() { return JSON.stringify(config); }
    }
  }, callback);
};
