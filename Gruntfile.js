module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cedict: { 'cedict.json': 'cedict_ts.u8' },

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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerMultiTask('cedict', 'Parse Cedict and output a JSON blob', function() {
    var file = this.files.shift(), src = file.src.shift(), dest = file.dest;
    if (!src) { grunt.fail.fatal('File ' + this.data + ' not found.'); }

    var cedict = require('./cedict.js').parse(grunt.file.read(src));

    grunt.file.write(file.dest, JSON.stringify(cedict));
    grunt.log.writeln('File ' + file.dest.cyan + ' created.');
  });

  grunt.registerTask('default', ['cedict', 'compass']);
};
