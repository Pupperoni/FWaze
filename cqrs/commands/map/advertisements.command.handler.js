const Redis = require("ioredis");

const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const redis = new Redis(process.env.REDIS_URL);
const eventHandler = require("../../eventListeners/map/advertisements.event.handler");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const writeRepo = require("../../writeRepositories/map/advertisements.write.repository");
const Handler = {
  // create a report
  adCreated(data, file) {
    // validate data sent here
    var valid = true;

    // get role of user and check if advertiser
    return userAggregate.getCurrentState(data.userId).then(user => {
      // user is regular (not valid)
      if (user.role === 0) valid = false;

      // continue if all tests pass
      if (valid) {
        // generate unique id
        data.id = shortid.generate();

        // Create event instance
        var event = {
          id: shortid.generate(),
          eventName: "AD CREATED",
          payload: {
            id: data.id,
            userId: user.id,
            userName: user.name,
            caption: data.caption,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
            location: data.address
          }
        };
        // check if file is uploaded
        if (file) event.payload.photoPath = file.path;

        // emit the event and save to read repo
        eventHandler.emit("adCreated", event.payload);

        // call write repo to save to event store
        writeRepo.saveEvent(event);

        // after validation, return the response
        return Promise.resolve(data);
      }
      // validation failed
      return Promise.reject("Invalid data received");
    });
  }
};

module.exports = Handler;
