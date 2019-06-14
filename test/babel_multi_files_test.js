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
  compact_format_single_file: function(test) {
    test.expect(1);

    const actual = grunt.file.read("temp/compact_format_single_file.js");
    const expected = grunt.file.read(
      "test/expected/compact_format_single_file.js"
    );
    test.equal(actual, expected, "Should create first file properly");

    test.done();
  },
  files_object_format: function(test) {
    test.expect(3);

    let actual = grunt.file.read("temp/files_object_format_a.js");
    let expected = grunt.file.read("test/expected/files_object_format_a.js");
    test.equal(actual, expected, "Should create first file properly");

    actual = grunt.file.exists("temp/files_object_format_a.js.map");
    expected = true;
    test.equal(actual, expected, "Should create map file");

    actual = grunt.file.exists("temp/files_object_format_b.js");
    expected = false;
    test.equal(
      actual,
      expected,
      "Should not create second file because of error"
    );

    test.done();
  },
  files_array_format: function(test) {
    test.expect(4);

    let actual = grunt.file.read("temp/files_array_format_a.js");
    let expected = grunt.file.read("test/expected/files_array_format_a.js");
    test.equal(actual, expected, "Should create first file properly");

    actual = grunt.file.exists("temp/files_array_format_a.js.map");
    expected = false;
    test.equal(actual, expected, "Should not create map file for first file");

    actual = grunt.file.read("temp/files_array_format_b.js");
    expected = grunt.file.read("test/expected/files_array_format_b.js");
    test.equal(actual, expected, "Should create second file properly");

    actual = grunt.file.exists("temp/files_array_format_b.js.map");
    expected = false;
    test.equal(actual, expected, "Should not create map file for second file");

    test.done();
  },
  dynamic_mappings: function(test) {
    const TEMP_CWD = "temp/dynamic_mappings/";
    const filesGenerated = grunt.file.expand(
      {
        cwd: TEMP_CWD
      },
      ["**/*.js", `!${TEMP_CWD}nested/*_a.js`]
    );

    test.expect(filesGenerated.length);

    for (const fileGenerated of filesGenerated) {
      const actual = grunt.file.read(`${TEMP_CWD}${fileGenerated}`);
      const expected = grunt.file.read(
        `test/expected/dynamic_mappings/${fileGenerated}`
      );
      test.equal(actual, expected, `Should create "${fileGenerated}" properly`);
    }

    test.done();
  }
};
