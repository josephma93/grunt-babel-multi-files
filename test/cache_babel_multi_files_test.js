"use strict";

const grunt = require("grunt");

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.babel_multi_files = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  files_array_format_using_cache: function(test) {
    test.expect(2);

    let actual = grunt.file.read("temp/files_array_format_a.js");
    let expected = grunt.file.read("test/expected/files_array_format_a.js");
    test.equal(actual, expected, "Should create first file properly");

    actual = grunt.file.exists("temp/files_array_format_a.js.map");
    expected = false;
    test.equal(actual, expected, "Should not create map file for first file");

    test.done();
  }
};
