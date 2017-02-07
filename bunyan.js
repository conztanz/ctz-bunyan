'use script';

const bunyan = require("bunyan");
const bunyanLogstash = require("bunyan-logstash-tcp");

module.export = {
  createLogger: function(options) {

    let stdoutStream = function(options) {
      let level = options && options.stdout && options.stdout.level ? options.stdout.level : "debug";
      return {
        name: 'stdout',
        stream: process.stdout,
        level: level
      };
    };

    let rotatingFileStream = function(options) {
      let path = options.rotatingFile.path ? options.rotatingFile.path : "/var/logs/" + options.name;
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

    let logstashStream = function(options) {
      let host = options.logstash.host ? options.logstash.host : "localhost";
      let port = options.logstash.port ? options.logstash.port : 5000;
      let tags = options.logstash.tags
      let level = options.logstash.level ? options.logstash.level : "info";
      let stream = bunyanLogstash.createStream({
        application: options.name,
        host: host,
        port: port,
        tags: tags,
        type: options.name
      });
      stream.on("timeout", function() {
        logger.info("timeout while connecting to logstash");
      });
      stream.on("error", function(error) {
        logger.error({
          stacktrace: error.stack
        });
      });
      stream.on("connect", function() {
        logger.info("logger connected to logstash");
      });
      stream.on("close", function() {
        logger.info("logstash connection closed");
      });
      return {
        type: "raw",
        level: level,
        stream: stream
      }
    };

    let streams = [];
    streams.push(stdoutStream(options));
    if (options && options.rotatingFile) {
      streams.push(rotatingFileStream(options));
    }
    if (options && options.logstash) {
      streams.push(logstashStream(options));
    }

    return bunyan.createLogger({
      name: options.name,
      streams: streams
    });
  }
};
