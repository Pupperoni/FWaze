const Redis = require("ioredis");

const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const redis = new Redis(process.env.REDIS_URL);
const eventHandler = require("../../eventListeners/map/reports.event.handler");

const Handler = {
  // create a report
  reportCreated(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("reportCreated", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  },

  voteCreated(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("voteCreated", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  },

  voteDeleted(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("voteDeleted", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  }
};

module.exports = Handler;
