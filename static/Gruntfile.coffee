module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      options:
        sourceMap: true
      build:
        files:
          'register.js': ['register.coffee']
          'login.js': ['login.coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask 'default', ['coffee']
