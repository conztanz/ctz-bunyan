"use strict";

module.exports = options => {
  let level = options && options.stdout && options.stdout.level ? options.stdout.level : "debug";
  return {
    name: 'stdout',
    stream: process.stdout,
    level: level
  };
};
