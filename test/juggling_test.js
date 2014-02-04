'use strict';

var grunt = require('grunt');
var juggling = require('../tasks/juggling');

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

exports.juggling = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    defaultCall: function (test) {
        test.expect(3);

        var actual = JSON.parse(juggling["juggling:defaultCall"].schema.adapter.cache["tests1"]['1']);
        var expected = grunt.file.readJSON('test/test_fixture.json')[0].data[0];

        test.ok(!!actual.id && actual.id > 0, "should have an id");
        test.equal(expected.key, actual.key, "keys should match");
        test.equal(expected.value, actual.value, "values should match");

        test.done();
    }
};
