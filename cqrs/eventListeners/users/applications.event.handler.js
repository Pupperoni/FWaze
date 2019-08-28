const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/users/applications.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

emitter.on(constants.APPLICATION_CREATED, function(data) {
  console.log("event received: application created");
  redis.hmset(
    `application:${data.userId}`,
    `userId`,
    data.userId,
    `userName`,
    data.userName,
    `timestamp`,
    data.timestamp
  );

  // Save to MySQL
  queryHandler.createApplication(data);
});

module.exports = emitter;
