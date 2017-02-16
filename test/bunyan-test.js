"use strict";
const chai = require("chai");
const assert = chai.assert;
const bunyan = require("../bunyan");

describe("ctz-bunyan", function() {
  describe("std", function() {
    const testCases = [{ in: null,
        expected: {
          name: 'stdout',
          stream: process.stdout,
          level: 20
        }
      },
      { in: {
          stdout: {
            level: "info"
          }
        },
        expected: {
          name: 'stdout',
          stream: process.stdout,
          level: 30
        }
      }
    ]
    testCases.forEach(function(testCase) {
      let match = false;
      let log = bunyan.createLogger(testCase.in);
      log.streams.forEach(function(logStream) {
        if (!match && logStream.name == testCase.expected.name && logStream.level == testCase.expected.level && logStream.stream == testCase.expected.stream) {
          match = true;
        }
      });
      assert.equal(match, true);
    });

  });

  describe("rotating-file", function() {

  });

  describe("logstash", function() {

  });
})
