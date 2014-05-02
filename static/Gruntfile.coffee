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
        coffee:
            options:
                sourceMap: true
            build:
                expand: true
                cwd: 'src'
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
        watch:
            files: ['src/**/*.coffee']
            tasks: ['coffee', 'uglify']

    grunt.loadNpmTasks 'grunt-coffeelint'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-uglify'

    grunt.registerTask 'default', ['coffeelint', 'coffee', 'uglify']
