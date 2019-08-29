const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/users/users.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

emitter.on(constants.USER_CREATED, function(data) {
  console.log("event received: user created");
  redis
    .hmset(
      `user:${data.id}`,
      `id`,
      data.id,
      `name`,
      data.name,
      `email`,
      data.email,
      `password`,
      data.password,
      `role`,
      data.role
    )
    .then(() => {
      // To access a user by his name, we store his id somewhere
      redis.set(`user:name:${data.name}`, data.id);

      // save home and work (initially none)
      redis.hmset(
        `user:${data.id}:home`,
        `latitude`,
        "",
        `longitude`,
        "",
        `address`,
        ""
      );
      redis.hmset(
        `user:${data.id}:work`,
        `latitude`,
        "",
        `longitude`,
        "",
        `address`,
        ""
      );
    });

  // Save to MySQL
  queryHandler.createUser(data);
});

emitter.on(constants.USER_UPDATED, function(data) {
  console.log("event received: user updated");
  // Update redis data
  if (data.name) {
    // delete old name checker
    redis.del(`user:name:${data.name}`);
    // set new name
    redis.hset(`user:${data.id}`, `name`, data.name);
    // Update reports
    redis.smembers(`reports:${data.id}`).then(reportIds => {
      reportIds.forEach(id => {
        redis.hset(`report:${id}`, `userName`, data.name);
      });
    });
    // Update ads
    redis.smembers(`ads:${data.id}`).then(reportIds => {
      reportIds.forEach(id => {
        redis.hset(`ad:${id}`, `userName`, data.name);
      });
    });
    // Update name checker
    redis.set(`user:name:${data.name}`, data.id);
  }

  if (data.email) redis.hset(`user:${data.id}`, `email`, data.email);
  if (data.role) redis.hset(`user:${data.id}`, `role`, data.role);

  if (data.avatarPath)
    redis.hset(`user:${data.id}`, `avatarPath`, data.avatarPath);
  // Update MySQL data
  if (data.name && data.email) queryHandler.updateUser(data);
});

emitter.on(constants.USER_HOME_UPDATED, function(data) {
  console.log("event received: home address updated");
  redis.hmset(
    `user:${data.id}:home`,
    `latitude`,
    data.latitude,
    `longitude`,
    data.longitude,
    `address`,
    data.address
  );

  queryHandler.setHomeAd(data.id, data.address);
});

emitter.on(constants.USER_WORK_UPDATED, function(data) {
  console.log("event received: work address updated");
  redis.hmset(
    `user:${data.id}:work`,
    `latitude`,
    data.latitude,
    `longitude`,
    data.longitude,
    `address`,
    data.address
  );

  queryHandler.setWorkAd(data.id, data.address);
});

emitter.on(constants.USER_ROUTE_CREATED, function(data) {
  console.log("event received: fave route created");

  queryHandler.createFaveRoute(data);
});

emitter.on(constants.USER_ROUTE_DELETED, function(data) {
  console.log("event received: fave route deleted");

  queryHandler.deleteFaveRoute(data);
});

module.exports = emitter;
