module.exports = function(grunt) {

  var parseCedictRow = function(row) {
    var matches = /^(.+?) (.+?) \[(.+?)\] \/(.+?)\/$/.exec(row.trim());
    return [matches[2], {
      transcription: matches[3].toLowerCase(),
      translation: matches[4].split('/').filter(function(translation) {
        return !(translation[0] === 'C' && translation[1] === 'L');
      }).join(' - ')
    }];
  };

  grunt.registerMultiTask('cedict', 'Parse cedict and generate a card generator', function() {
    var file = this.files.shift(),
        src = file.src.shift();
    if (!src) { grunt.fail.fatal('File ' + this.data + ' not found.'); }
    var fileContents = grunt.file.read(src, 'utf-8'),
        rows = fileContents.trim().split('\n').slice(59),
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

    var vocabularyGenerator = function(cedict) {
      return function(vocabulary) {
        var _ = require('underscore');
        vocabulary = vocabulary.trim().split('\n').map(function(line) {
          return line.trim();
        });
        return _.chain(cedict).pick(vocabulary).pairs().map(function(pair) {
          pair[1].glyph = pair[0];
          return pair[1];
        }).value();
      };
    };

    var destSrc = 'module.exports = (' +
        vocabularyGenerator.toString() +
        '(' + JSON.stringify(dict) + '));';
    grunt.file.write(file.dest, destSrc);

    grunt.log.writeln('File ' + file.dest.cyan + ' created.');
  });
};
