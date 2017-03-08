"use strict";
const bunyan = require("./bunyan");

let log = bunyan.createLogger({
  name: "helloworld",
  stdout: {
    level: "debug",
  },
  rotatingFile: {
    path: "/var/logs/helloworld",
    period: "1d",
    count: 7,
    level: "info"
  },
  logstash: {
    host: "localhost",
    port: 5000,
    level: "info",
    tags: null
  }
});

log.info('hi');
log.warn({
  lang: 'fr'
}, 'au revoir');

function Wuzzle(options) {
  this.log = options.log.child({
    widget_type: 'wuzzle'
  });
  this.log.info('creating a wuzzle')
}
Wuzzle.prototype.woos = function() {
  this.log.warn('This wuzzle is woosey.')
}

log.info('start');
var wuzzle = new Wuzzle({
  log: log
});
wuzzle.woos();
log.info('done');
