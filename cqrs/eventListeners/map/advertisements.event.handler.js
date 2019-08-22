const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/advertisements.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();
const constants = require("../../../constants");

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

emitter.on(constants.AD_CREATED, function(data) {
  console.log("event received: ad created");
  // Add to redis
  if (data.photoPath) {
    redis.hmset(
      `ad:${data.id}`,
      "id",
      data.id,
      "caption",
      data.caption,
      "userId",
      data.userId,
      "userName",
      data.userName,
      "longitude",
      data.longitude,
      "latitude",
      data.latitude,
      "location",
      data.location,
      "photoPath",
      data.photoPath
    );
  } else {
    redis.hmset(
      `ad:${data.id}`,
      "id",
      data.id,
      "caption",
      data.caption,
      "userId",
      data.userId,
      "userName",
      data.userName,
      "longitude",
      data.longitude,
      "latitude",
      data.latitude,
      "location",
      data.location
    );
  }

  // Add to MySQL
  queryHandler.createAd(data);
});

module.exports = emitter;
