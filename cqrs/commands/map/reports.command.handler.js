const Redis = require("ioredis");

const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const redis = new Redis(process.env.REDIS_URL);
const eventHandler = require("../../eventListeners/map/reports.event.handler");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const writeRepo = require("../../writeRepositories/map/reports.write.repository");
const Handler = {
  // create a report
  reportCreated(data, file) {
    // validate data sent here
    var valid = true;

    // get role of user and check if advertiser
    return userAggregate.getCurrentState(data.userId).then(user => {
      // user does not exist
      if (!user) valid = false;
      // invalid report type
      if (data.type < 0 || data.type > 8) valid = false;

      // continue if all tests pass
      if (valid) {
        // generate unique id
        data.id = shortid.generate();

        // Create event instance
        var event = {
          id: shortid.generate(),
          eventName: "REPORT CREATED",
          payload: {
            id: data.id,
            userId: user.id,
            userName: user.name,
            type: data.type,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
            location: data.address
          }
        };
        // check if file is uploaded
        if (file) event.payload.photoPath = file.path;

        // emit the event and save to read repo
        eventHandler.emit("reportCreated", event.payload);

        // call write repo to save to event store
        writeRepo.saveEvent(event);

        // after validation, return the response
        return Promise.resolve(data);
      }
      // validation failed
      return Promise.reject("Invalid data received");
    });
  },

  voteCreated(data) {
    // validate data sent here
    var valid = true;

    // continue if data is valid
    if (valid) {
      // Create event instance
      var event = {
        id: shortid.generate(),
        eventName: "REPORT VOTE_CREATED",
        payload: {
          id: data.reportId,
          userId: data.userId
        }
      };

      // emit the event after all data is good
      eventHandler.emit("voteCreated", event.payload);

      // save the create event to eventstore
      writeRepo.saveEvent(event);

      // after validation, return the response
      return Promise.resolve(data);
    }
    // validation failed
    return Promise.reject("Invalid data received");
  },

  voteDeleted(data) {
    // validate data sent here
    var valid = true;

    if (valid) {
      // Create event instance
      var event = {
        id: shortid.generate(),
        eventName: "REPORT VOTE_DELETED",
        payload: {
          id: data.reportId,
          userId: data.userId
        }
      };

      // emit the event after all data is good
      eventHandler.emit("voteDeleted", event.payload);

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
