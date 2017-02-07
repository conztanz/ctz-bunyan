"use strict"
const bunyan = require("./bunyan");
let log = bunyan.createLogger({
  name: "helloworld",
  stdout: {
    level: "debug",
  },
  logstash: {
    host: "elk-cz-test.conztanz.com",
    port: 5000,
    level: "info",
    tags: []
  }
});

log.info('hi');
log.warn({
  lang: 'fr'
}, 'au revoir');
