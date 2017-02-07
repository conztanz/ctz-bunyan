"use strict"
const bunyan = require("./bunyan");
let log = bunyan.createLogger({
  name: "helloworld",
  stdout: {
    level: "debug",
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
