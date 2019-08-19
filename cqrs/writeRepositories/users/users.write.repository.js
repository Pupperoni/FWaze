const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

module.exports = {
  saveEvent(event) {
    // Get last offset from event store
    redis.zrange("events", 0, -1, "WITHSCORES").then(result => {
      var offset;
      // empty list so start at 0
      if (result.length == 0) offset = 0;
      else offset = parseInt(result[result.length - 1]) + 1; // incr 1 last el

      // save to eventstore
      redis.zadd("events", offset, JSON.stringify(event));
    });
  }
};
