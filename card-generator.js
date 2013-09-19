var _ = require('underscore'),
    cedict = require('./cedict.js');

var parseVocabulary = function(vocabulary) {
  return vocabulary.trim().split('\n').map(function(s) {
    return s.trim();
  });
};

exports.generateCardsFromVocabulary = function(vocabulary) {
  vocabulary = parseVocabulary(vocabulary);
  return _.chain(cedict).pick(vocabulary).pairs().map(function(pair) {
    pair[1].glyph = pair[0];
    return pair[1];
  }).value();
};
