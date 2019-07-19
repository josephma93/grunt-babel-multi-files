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
  dynamic_mappings_using_cache: function(test) {
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
