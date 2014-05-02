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
                    'forgot.js': ['forgot.coffee']
                    'reset.js': ['reset.coffee']
        uglify:
            my_target:
                options:
                    sourceMap: true
                files:
                    'register.min.js': ['register.js']
                    'login.min.js': ['login.js']
                    'forgot.min.js': ['forgot.js']
                    'reset.min.js': ['reset.js']

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-uglify'

    grunt.registerTask 'default', ['coffee', 'uglify']
