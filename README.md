[![NPM Version](http://img.shields.io/npm/v/ctz-bunyan.svg?style=flat)](https://www.npmjs.org/package/ctz-bunyan)

# get started

## Instanciate a logger
* We are using default values in the following:

```javascript
const bunyan = require("ctz-bunyan");

let log = bunyan.createLogger({
  name: "helloworld",
  stdout:{
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
log.warn({lang: 'fr'}, 'au revoir');
```
* As default values were used in the previous example, the following is equivalent:

```javascript
const bunyan = require("ctz-bunyan");

let log = bunyan.createLogger({
  name: "helloworld"
});

log.info('hi');
log.warn({lang: 'fr'}, 'au revoir');
```

## Inheritence

Bunyan has a concept of a child logger to specialize a logger for a sub-component of your application, i.e. to create a new logger with additional bound fields that will be included in its log records. A child logger is created with `log.child(...)`.

```javascript
const bunyan = require("ctz-bunyan");

let log = bunyan.createLogger({
  name: "helloworld"
});

function Wuzzle(options) {
    this.log = options.log.child({widget_type: 'wuzzle'});
    this.log.info('creating a wuzzle')
}
Wuzzle.prototype.woos = function () {
    this.log.warn('This wuzzle is woosey.')
}

log.info('start');
var wuzzle = new Wuzzle({log: log});
wuzzle.woos();
log.info('done');
```
