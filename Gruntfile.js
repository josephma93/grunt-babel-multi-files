/*
 * grunt-babel-multi-files
 * https://github.com/josephma93/grunt-babel-multi-files
 *
 * Copyright (c) 2019 Joseph Montero
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ["tmp"]
    },

    // Configuration to be run (and then tested).
    babel_multi_files: {
      compact_format_single_file: {
        options: {
          sourceMaps: false,
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "ie 11, > 5%"
              }
            ]
          ]
        },
        src: ["test/fixtures/file_a.js"],
        dest: "temp/compact_format_single_file.js"
      },
      files_object_format: {
        options: {
          sourceMaps: true,
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "last 1 Electron version"
              }
            ]
          ]
        },
        files: {
          "temp/files_object_format_a.js": [
            "test/fixtures/*_first.js",
            "test/fixtures/*.js"
          ],
          "temp/files_object_format_b.js": [
            "test/fixtures/nested/*_first.js",
            "test/fixtures/nested/*.js"
          ]
        }
      },
      files_array_format: {
        files: [
          {
            src: ["test/fixtures/*_first.js", "test/fixtures/*.js"],
            dest: "temp/files_array_format_a.js"
          },
          {
            src: ["test/fixtures/nested/*.js", "!test/fixtures/nested/*_a.js"],
            dest: "temp/files_array_format_b.js"
          }
        ]
      },
      dynamic_mappings: {
        // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [
          {
            expand: true,
            cwd: "test/fixtures/",
            src: ["**/*.js", "!nested/*_a.js"],
            dest: "temp/dynamic_mappings/",
            ext: ".compiled.js",
            extDot: "first"
          }
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ["test/*_test.js"]
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks("tasks");

  // These plugins provide necessary tasks.;
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask("test", ["clean", "babel_multi_files", "nodeunit"]);

  // By default, run all tests.
  grunt.registerTask("default", ["test"]);
};
