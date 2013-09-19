var program = require('commander'),
    pkg = require('./package.json'),
    cardGenerator = require('./card-generator.js'),
    browserify = require('browserify'),
    express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

// Arguments
program
  .version(pkg.version)
  .usage('[vocabulary]')
  .parse(process.argv);
var vocabularyFile = program.args.shift();

// Write new cards file
var cedict = fs.readFileSync('./assets/cedict/cedict_ts.u8', 'utf-8'),
    vocabulary = fs.readFileSync(vocabularyFile, 'utf-8'),
    cards = cardGenerator.generateCardsFromCedictAndVocabulary(cedict, vocabulary);
fs.writeFileSync(path.join(__dirname, 'cards.js'), 'module.exports = ' + JSON.stringify(cards) + ';');

var scriptBundle = browserify('./lightcards/main.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'assets')));

// Serve the script bundle
app.get('/script.js', function(req, res) { scriptBundle.bundle().pipe(res); });

http.createServer(app).listen(app.get('port'), function() {
  console.log('Get learning on port ' + app.get('port') + '!');
});
