module.exports = function(grunt) {

  grunt.registerMultiTask('cedict', 'Parse cedict and generate a card generator', function() {

    this.files.forEach(function(file) {
      var parseCedictRow = function(row) {
        var matches = /^(.+?) (.+?) \[(.+?)\] \/(.+?)\/$/.exec(row.trim());
        return [matches[2], {
          transcription: matches[3],
          translation: matches[4].split('/').filter(function(translation) {
            return !(translation[0] === 'C' && translation[1] === 'L');
          }).join(' - ')
        }];
      };

      var fileContents = grunt.file.read(file.src.shift(), 'utf-8'),
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
  });
};
