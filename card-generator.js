var _ = require('underscore');

var parseCedictRow = function(row) {
  var matches = /^(.+?) (.+?) \[(.+?)\] \/(.+?)\/$/.exec(row.trim());
  return [matches[2], {
    transcription: matches[3],
    translation: matches[4].split('/').filter(function(translation) {
      return !(translation[0] === 'C' && translation[1] === 'L');
    }).join(' - ')
  }];
};

var parseCedict = function(cedict) {
  var rows = cedict.trim().split('\n').slice(59),
      dict = {};
  for (var i = 0, length = rows.length; i < length; i++) {
    var row = parseCedictRow(rows[i]),
        key = row[0],
        value = row[1];
    if (dict[key]) {
      dict[key].alternatives = dict[key].alternatives || [];
      dict[key].alternatives.push(value);
    } else {
      dict[key] = value;
    }
  }
  return dict;
};

var parseVocabulary = function(vocabulary) {
  return vocabulary.trim().split('\n').map(function(s) {
    return s.trim();
  });
};

exports.generateCardsFromCedictAndVocabulary = function(cedict, vocabulary) {
  cedict = parseCedict(cedict);
  vocabulary = parseVocabulary(vocabulary);
  return _.chain(cedict).pick(vocabulary).pairs().map(function(pair) {
    pair[1].glyph = pair[0];
    return pair[1];
  }).value();
};
