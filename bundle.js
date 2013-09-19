var fs = require('fs'),
    path = require('path'),
    browserify = require('browserify'),
    cardGenerator = require('./card-generator.js');

var script;

exports.init = function(options) {
  // Write new cards file
  var cedict = fs.readFileSync('./assets/cedict/cedict_ts.u8', 'utf-8'),
      vocabulary = fs.readFileSync(options.vocabularyFile, 'utf-8'),
      cards = cardGenerator.generateCardsFromCedictAndVocabulary(cedict, vocabulary);
  fs.writeFileSync(path.join(__dirname, 'cards.js'), 'module.exports = ' + JSON.stringify(cards) + ';');
  script = browserify('./lightcards/main.js');
};

exports.pipe = function(stream) {
  script.bundle().pipe(stream);
};
