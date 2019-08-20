const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

module.exports = {
  saveEvent(event) {
    // extract aggregate from event name (e.g. USER CREATED -> gets USER)
    var aggregateName = event.eventName.split(" ")[0];
    // identifier of aggregate
    var aggregateID = event.payload.id;

    // Get last offset from event store
    redis
      .zrange(`event:${aggregateName}:${aggregateID}`, 0, -1, "WITHSCORES")
      .then(result => {
        var offset;
        // if empty list, start at 0
        if (result.length == 0) offset = 0;
        else offset = parseInt(result[result.length - 1]) + 1; // incr 1 last el

        // save to eventstore
        redis.zadd(
          `event:${aggregateName}:${aggregateID}`,
          offset,
          JSON.stringify(event)
        );

        // sanity checker
        redis
          .zrange(`event:${aggregateName}:${aggregateID}`, 0, -1, "WITHSCORES")
          .then(console.log);
      });
  }
};
