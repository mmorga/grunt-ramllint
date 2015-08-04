/*
 * grunt-ramllint
 * https://github.com/mmorga/grunt-ramllint
 *
 * Copyright (c) 2015 Mark Morga
 * Licensed under the Apache-2.0 license.
 */

'use strict';

var Linter = require('ramllint');
var path = require('path');
var async = require('async');
var colors = require('colors/safe');

// set theme
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var STATUS = {
  'error': colors.error,
  'info': colors.info,
  'warning': colors.warn
};


module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ramllint', 'Grunt plugin for ramllint', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        level: 'info'
      }),
      done = this.async(),
      errResults = {
        'error': 0,
        'info': 0,
        'warning': 0
      },
      srcs,
      ramllint = new Linter();

    srcs = this.files.map(function (f) {
      return f.src;
    }).reduce(function (pv, cv) {
      return pv.concat(cv);
    }, []);

    async.eachSeries(srcs, function (src, callback) {
      ramllint.lint(path.resolve(src), function () {
        var results = ramllint.results();
        if (!results.length) {
          grunt.log.ok('File "' + src + '" ok.');
          return callback(null);
        }

        // errors
        results.forEach(function entryFormat(entry) {

          var output = STATUS[entry.level](entry.level.toUpperCase()) + ' ' +
            entry.rule + '\n' +
            '  ' + entry.message + colors.debug(' [' + entry.code + ']') +
            (entry.hint ? colors.help('\nHINT:\n') + entry.hint : '');

          grunt.log.writeln(output);
          errResults[entry.level] += 1;
        });
        callback(null);
      });
    }, function () {
      var msg = 'Errors: ' + errResults['error'] +
        ', Warnings: ' + errResults['warning'] +
        ', Info: ' + errResults['info'];
      if (errResults['error'] + errResults['warning'] > 0) {
        grunt.fatal(msg);
      } else {
        grunt.log.writeln(msg);
      }
      done();
    });
  });
};