module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        coffeelint:
            all:
                files:
                    src: ['src/*.coffee']
                options:
                    'indentation':
                        'value': 4
                    'max_line_length':
                        'value': 120
        coffee:
            build:
                expand: true
                cwd: 'src/'
                src: ['**/*.coffee']
                dest: 'build'
                ext: '.js'
        uglify:
            dist:
                files:[
                    expand: true
                    cwd: 'build/'
                    src: ['**/*.js', '!**/*.min.js']
                    dest: 'build/'
                    ext: '.min.js'
                    extDot: 'first'
                ]
            options:
              sourceMap: true

    grunt.loadNpmTasks 'grunt-coffeelint'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-uglify'

    grunt.registerTask 'default', ['coffeelint', 'coffee', 'uglify']
