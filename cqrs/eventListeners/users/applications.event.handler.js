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
    `application:${data.id}`,
    `userId`,
    data.userId,
    `userName`,
    data.userName,
    `status`,
    0,
    `timestamp`,
    data.timestamp
  );

  redis.set(`user:${data.userId}:application`, data.id);

  // Save to MySQL
  queryHandler.createApplication(data);
});

emitter.on(constants.APPLICATION_APPROVED, function(data) {
  console.log("event received: application approved");
  redis.hmset(`application:${data.userId}`, `status`, 1);

  redis.del(`user:${data.userId}:application`);

  // Save to MySQL
  queryHandler.approveApplication(data);
});

emitter.on(constants.APPLICATION_REJECTED, function(data) {
  console.log("event received: application rejected");
  redis.hmset(`application:${data.userId}`, `status`, -1);

  redis.del(`user:${data.userId}:application`);

  // Save to MySQL
  queryHandler.rejectApplication(data);
});

module.exports = emitter;
