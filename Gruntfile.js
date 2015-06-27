module.exports = function(grunt) {

  grunt.initConfig({
    react: {
      files: {
        expand: true,
        cwd: 'static/app/',
        src: ['**/*.jsx'],
        dest: 'static.build/app',
        ext: '.js'
      }
    },

    stylus: {
      files: {
        expand: true,
        cwd: 'static/app/',
        src: ['**/*.styl'],
        dest: 'static.build/app',
        ext: '.css'
      }
    },

    copy: {
      files: {
        expand: true,
        cwd: 'static/',
        src: ['**/*.js', '**/*.json', '**/*.wav', '**/*.mp3'],
        dest: 'static.build'
      }
    },

    watch: {
      files: ['static/**/*.*'],
      tasks: ['newer:react', 'newer:stylus', 'newer:copy']
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('build', ['react', 'stylus', 'copy']);
};
