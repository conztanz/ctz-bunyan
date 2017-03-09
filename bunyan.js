"use strict";

const bunyan = require("bunyan");
const bunyanLogstash = require("bunyan-logstash-tcp");
const bunyanRollbar = require('bunyan-rollbar');
bunyan.stdSerializers.err = bunyanRollbar.stdSerializers.err;

module.exports = {
  createLogger: function(options) {

    options = options ? options : {};
    options.name = options.name ? options.name : "default";

    let log = bunyan.createLogger({
      name: options.name,
      streams: []
    });

    const stdoutStream = options => {
      let level = options && options.stdout && options.stdout.level ? options.stdout.level : "debug";
      return {
        name: 'stdout',
        stream: process.stdout,
        level: level
      };
    };

    const rotatingFileStream = options => {
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

    const handleConFailures = stream => {
      if (stream) {
        stream.on("timeout", () => {
          log.info(`timeout while connecting to {stream.name}`);
        });
        stream.on("error", error => {
          log.error({
            stacktrace: error.stack
          });
        });
        stream.on("connect", () => {
          log.info(`logger connected to {stream.name}`);
        });
        stream.on("close", () => {
          log.info(`{stream.name} connection closed`);
        });
      }
    };

    const logstashStream = options => {
      let host = options.logstash.host ? options.logstash.host : "localhost";
      let port = options.logstash.port ? options.logstash.port : 5000;
      let tags = options.logstash.tags;
      let level = options.logstash.level ? options.logstash.level : "info";
      let stream = bunyanLogstash.createStream({
        application: options.name,
        host: host,
        port: port,
        tags: tags,
        type: options.name
      });
      stream.name = "logstash";
      handleConFailures(stream);
      return {
        type: "raw",
        level: level,
        stream: stream
      };
    };

    const rollbarStream = options => {
      if(!options.rollbar.token){
        throw new Error("wrong or missing rollbard access token");
      }
      let rollbarOptions = options.rollbar.rollbarOptions? options.rollbar.rollbarOptions: {}; // Additional options to pass to rollbar.init()
      let stream = new bunyanRollbar.Stream({
        rollbarToken: options.rollbar.token,
        rollbarOptions: rollbarOptions
      });
      stream.name = "rollbar";
      handleConFailures(stream);
      return {
        type: "raw",
        level: "warn",
        stream: stream
    };
  };

    log.stdout = stdoutStream(options);
    log.addStream(log.stdout);
    if (options && options.rotatingFile) {
      log.rotatingFile = rotatingFileStream(options);
      log.addStream(log.rotatingFile);
    }
    if (options && options.logstash) {
      log.logstash = logstashStream(options);
      log.addStream(log.logstash);
    }
    if(options && options.rollbar) {
      try{
        log.rollbar = rollbarStream(options);
        log.addStream(log.rollbar);
      }catch(err){
        log.warn(err);
      }
    }

    return log;
  }
};
