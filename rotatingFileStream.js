"use strict";

module.exports = options => {
  let path = options.rotatingFile.path ? options.rotatingFile.path : "/var/logs/" + options.name + ".log";
  let period = options.rotatingFile.period ? options.rotatingFile.period : "1d";
  let count = options.rotatingFile.count ? options.rotatingFile.count : 7;
  let level = options.rotatingFile.level ? options.rotatingFile.level : "info";
  return {
    type: 'rotating-file',
    path: path,
    period: period, // daily rotation
    count: count, // keep 7 back copies
    level: level
  };
};
