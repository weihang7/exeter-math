module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        coffeelint:
            all:
                files:
                    src: ['src/script/*.coffee']
                options:
                    'indentation':
                        'value': 4
                    'max_line_length':
                        'value': 120
        coffee:
            build:
                expand: true
                cwd: 'src/script/'
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
        jade:
            build:
                options:
                    pretty: true
                files: {
                    'index.html': 'src/index.jade'
                    'contest.html': 'src/contest.jade'
                    'archive.html': 'src/archive.jade'
                    'travel.html': 'src/travel.jade'
                    'contact.html': 'src/contact.jade'
                    'login.html': 'src/login.jade'
                    'register.html': 'src/register.jade'
                    'admin.html': 'src/admin.jade'
                    'scores.html': 'src/scores.jade'
                    'register_team.html': 'src/register_team.jade'
                    'list_scores.html': 'src/list_scores.jade'
                    'assign_ids.html': 'src/assign_ids.jade'
                    'forgot.html': 'src/forgot.jade'
                    'reset.html': 'src/reset.jade'
                    'grading.html': 'src/grading.jade'
                    'archive/2015results.html': 'src/archive/2015results.jade'
                }

    grunt.loadNpmTasks 'grunt-coffeelint'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jade'

    grunt.registerTask 'default', ['coffeelint', 'coffee', 'uglify', 'jade']
