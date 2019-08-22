const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/reports.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

emitter.on(constants.REPORT_CREATED, function(data) {
  console.log("event received: report created");

  // Add to redis
  if (data.photoPath) {
    redis.hmset(
      `report:${data.id}`,
      `id`,
      data.id,
      `userId`,
      data.userId,
      `userName`,
      data.userName,
      `longitude`,
      data.longitude,
      `latitude`,
      data.latitude,
      `location`,
      data.location,
      `type`,
      data.type,
      "photoPath",
      data.photoPath
    );
  } else {
    redis.hmset(
      `report:${data.id}`,
      `id`,
      data.id,
      `userId`,
      data.userId,
      `userName`,
      data.userName,
      `longitude`,
      data.longitude,
      `latitude`,
      data.latitude,
      `location`,
      data.location,
      `type`,
      data.type
    );
  }

  // Link users and reports
  redis.sadd(`reports:${data.userId}`, data.id);

  // Add to MySQL
  queryHandler.createReport(data);
});

emitter.on(constants.REPORT_VOTE_CREATED, function(data) {
  console.log("event received: vote created");
  // Add to redis
  redis.sadd(`user:${data.userId}:upvoting`, data.id);
  redis.sadd(`report:${data.id}:upvoters`, data.userId);
  // Add to mySQL
  queryHandler.addVote(data.id, data.userId);
});

emitter.on(constants.REPORT_VOTE_DELETED, function(data) {
  console.log("event received: vote deleted");
  // Remove from redis
  redis.srem(`user:${data.userId}:upvoting`, data.id);
  redis.srem(`report:${data.id}:upvoters`, data.userId);

  queryHandler.removeVote(data.id, data.userId);
});

module.exports = emitter;
