var fs = require('fs'),
    _ = require('underscore');

var vocabulary = fs.readFileSync(process.argv[3], 'utf-8').trim().split('\n').map(function(c) { return c.trim(); });

var makeDict = function(list) {
  var result = {};
  for (var i = 0, length = list.length; i < length; i++) {
    var key = list[i][0],
        value = list[i][1];
    if (result[key]) {
      result[key].alternatives = result[key].alternatives || [];
      result[key].alternatives.push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

var cedict = fs.readFileSync(process.argv[2], 'utf-8').trim().split('\n').slice(59);

cedict = cedict.map(function(row) {
  var matches = /^(.+?) (.+?) \[(.+?)\] \/(.+?)\/$/.exec(row.trim());
  return [matches[2], {
    transcription: matches[3],
    translation: matches[4].split('/').filter(function(translation) {
      return !(translation[0] === 'C' && translation[1] === 'L');
    }).join(' - ')
  }];
});

cedict = makeDict(cedict);

vocabulary = _.chain(cedict).pick(vocabulary).pairs().map(function(pair) {
  pair[1].glyph = pair[0];
  return pair[1];
}).value();

fs.writeFileSync(process.argv[4], 'window.cards = ' + JSON.stringify(vocabulary) + ';');
