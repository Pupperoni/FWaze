const Redis = require("ioredis");

const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const redis = new Redis(process.env.REDIS_URL);
const eventHandler = require("../../eventListeners/map/comments.event.handler");
const writeRepo = require("../../writeRepositories/map/comments.write.repository");
const Handler = {
  // create a report
  commentCreated(data) {
    // validate data sent here
    var valid = true;

    // if all tests pass, do important stuff
    if (valid) {
      // generate id
      data.id = shortid.generate();

      // Create event instance
      var event = {
        id: shortid.generate(),
        eventName: "COMMENT CREATED",
        payload: {
          id: data.id,
          userId: data.userId,
          userName: data.userName,
          reportId: data.reportId,
          body: data.body
        }
      };

      // emit the event after all data is good
      eventHandler.emit("commentCreated", event.payload);

      // save the create event to eventstore
      writeRepo.saveEvent(event);

      // return response
      return Promise.resolve(data);
    }

    // validation failed
    return Promise.reject("Invalid data received");
  }
};

module.exports = Handler;
