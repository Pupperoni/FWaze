const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../constants");
const userAggregate = require("../aggregateHelpers/users/users.aggregate");
const reportAggregate = require("../aggregateHelpers/map/reports.aggregate");

module.exports = {
  saveEvent(event) {
    let aggregateName = event.aggregateName;
    let aggregateID = event.aggregateID;
    let offset;
    // Get last offset from event store
    redis
      .zrevrange(`events:${aggregateName}:${aggregateID}`, 0, 0, "WITHSCORES")
      .then(result => {
        // if empty list, start at 0
        if (result.length == 0) offset = 0;
        else offset = parseInt(result[1]) + 1; // incr 1 last el
      })
      .then(() => {
        // save to eventstore
        redis.zadd(
          `events:${aggregateName}:${aggregateID}`,
          offset,
          JSON.stringify(event)
        );

        // sanity checker
        // redis
        //   .zrange(`events:${aggregateName}:${aggregateID}`, 0, -1, "WITHSCORES")
        //   .then(console.log);
      })
      .then(() => {
        // save snapshot after 50 offsets
        if ((offset + 1) % 50 === 0) {
          // could separate these into multiple files for cleaner code i guess
          switch (aggregateName) {
            case constants.USER_AGGREGATE_NAME:
              return userAggregate.getCurrentState(aggregateID);
            case constants.REPORT_AGGREGATE_NAME:
              return reportAggregate.getCurrentState(aggregateID);
          }
        }
      })
      .then(aggregate => {
        if (aggregate) {
          console.log(`Snapshot updated: ${offset}`);
          // save currentstate with offset
          redis.hset(
            `snapshot:${aggregateName}:${aggregateID}`,
            "offset",
            offset,
            "currentState",
            JSON.stringify(aggregate)
          );
        }
      });
  }
};
