'use strict';
const Database = require('./Database');

function RateLimit(args) {

  let config = {
    resetPeriod: args.resetPeriod || 60 * 60 * 1000,
    max: args.max || 1000,
    statusCode: args.statusCode || 429,
  };

  config.db = config.db || new Database(config.resetPeriod);
  config.nextResetTime = Date.now() + config.resetPeriod;
  console.log(config, new Date(config.nextResetTime).toLocaleString());

  function rateLimit(req, res, next) {
    let key = req.ip;

    config.db.onRequest(key, function(err, current) {
      if (err) {
        return next(err);
      }
      
      res.setHeader('X-RateLimit-Remaining', Math.max(config.max - current, 0));
      res.setHeader('X-RateLimit-Reset', config.nextResetTime);
      
      if (config.max && current > config.max) {
        return res.sendStatus(config.statusCode);
      }

      next();

    });
  }

  rateLimit.clearIp = config.db.clearKey.bind(config.db);
  rateLimit.clearAll = config.db.clearAll.bind(config.db);

  setInterval(() => {

    rateLimit.clearAll();
    config.nextResetTime += config.resetPeriod;

  }, config.resetPeriod).unref();

  return rateLimit;
}

module.exports = RateLimit;