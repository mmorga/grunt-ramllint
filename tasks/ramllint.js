/*
 * grunt-ramllint
 * https://github.com/mmorga/grunt-ramllint
 *
 * Copyright (c) 2015 Mark Morga
 * Licensed under the Apache-2.0 license.
 */

'use strict';

var Linter = require('ramllint');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ramllint', 'Grunt plugin for ramllint', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        level: 'info'
      }),
      ramllint = new Linter();

    // Iterate over all specified file groups.
    this.files.forEach(function (f) {
      // Concat specified files.
      var src = f.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        ramllint(filepath, function (results) {
          // NOTE: results will only contain 'error' and will exclude 'warning' and 'info'
          // to get an array of all log entries use: `ramllint.results()`

          if (!results.length) {
            grunt.log.ok('File "' + filepath + '" ok.');
          } else {
            // errors
            results.forEach(function (err) {
              grunt.log.error(err);
            });
          }
        });
      });
    });
  });
};
