module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          require: ['animation'],
          sassDir: 'assets/sass',
          cssDir: 'assets/css'
        }
      }
    },
    watch: {
      styles: {
        files: ['assets/sass/*.sass'],
        tasks: ['compass']
      }
    },
    cedict: {
      'cedict.js': './assets/cedict/cedict_ts.u8'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerMultiTask('cedict', 'Parse cedict and generate a JSON data structure.', function() {
    var parseCedictRow = function(row) {
      var matches = /^(.+?) (.+?) \[(.+?)\] \/(.+?)\/$/.exec(row.trim());
      return [matches[2], {
        transcription: matches[3],
        translation: matches[4].split('/').filter(function(translation) {
          return !(translation[0] === 'C' && translation[1] === 'L');
        }).join(' - ')
      }];
    };

    var fs = require('fs'),
        fileContents = fs.readFileSync(this.data, 'utf-8'),
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

    fs.writeFileSync(this.target, 'module.exports = (' + vocabularyGenerator.toString() + '(' + JSON.stringify(dict) + '));');
  });

  grunt.registerTask('default', ['compass']);
};
