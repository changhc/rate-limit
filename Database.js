'use strict';
const redis = require('redis').createClient();

redis.on('error', (err) => {
  console.log(`Redis:\t${err}`);
});

function Database(resetPeriod) {
  const hashName = 'ipList';

  this.onRequest = function (key, callback) {
    redis.hexists(hashName, key, (err, exists) => {
      if (err) {
        return console.error(err);
      }
      if (exists) {
        redis.hincrby(hashName, key, 1, (err, result) => {
          if (err) {
            return console.error(err);
          }

          redis.hget(hashName, key, (err, result) => {
            callback(null, result);
          });

        });

      } else {
        console.log(redis.hset(hashName, key, 1, (err, result) => {
          if (err) {
            return console.error(err);
          }

          redis.hget(hashName, key, (err, result) => {
            callback(null, result);
          });

        }));
      }
    });
  };

  this.clearAll = function () {
    redis.del(hashName);
  };

  this.clearKey = function (key) {
    redis.hdel(hashName, key);
  };
  
}

module.exports = Database;