/*
 * grunt-juggling
 * https://github.com/CKing/grunt-juggling
 *
 * Copyright (c) 2014 Christopher König
 * Licensed under the MIT license.
 */

'use strict';
var Schema = require("jugglingdb").Schema;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('juggling', 'Grunt plugin to create jugglingdb database structure and import fixtures.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      driver: "memory",
      driver_options: {}
    });

    var files = this.data.models || null;
    var fixtures = this.data.fixtures || null;

    var schema = new Schema
    console.log(files, fixtures, options);
/*
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });*/
  });

};
