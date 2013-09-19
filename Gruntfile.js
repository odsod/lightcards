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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['compass']);
};
