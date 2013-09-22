module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cedict: { 'cedict.js': 'cedict_ts.u8' },

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

  grunt.loadTasks('./tasks');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['compass']);
};
