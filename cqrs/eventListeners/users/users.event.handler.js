const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/users/users.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

emitter.on("userCreated", function(data) {
  console.log("event received: user created");
  console.log(data);
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

emitter.on("userUpdated", function(data) {
  console.log("event received: user updated");
  console.log(data);
});

emitter.on("homeAddressUpdated", function(data) {
  console.log("event received: home address updated");
  console.log(data);
});

emitter.on("workAddressUpdated", function(data) {
  console.log("event received: work address updated");
  console.log(data);
});

module.exports = emitter;
