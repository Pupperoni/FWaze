const shortid = require("shortid");
const eventHandler = require("../../eventListeners/map/advertisements.event.handler");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const Handler = {
  // create a report
  adCreated(data, file) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // get role of user and check if advertiser
    return userAggregate.getCurrentState(data.userId).then(user => {
      console.log(user);
      // user does not exist
      if (!user) {
        valid = false;
        reason = constants.USER_NOT_EXISTS;
      }
      // user is regular (not valid)
      if (user.role === "0" || user.role === 0) {
        valid = false;
        reason = constants.USER_NOT_PERMITTED;
      }

      // continue if all tests pass
      if (valid) {
        // generate unique id
        data.id = shortid.generate();
        // Create event instance
        let event = {
          eventId: shortid.generate(),
          eventName: constants.AD_CREATED,
          aggregateName: constants.AD_AGGREGATE_NAME,
          aggregateID: data.id,
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
        eventHandler.emit(constants.AD_CREATED, event.payload);

        // call write repo to save to event store
        writeRepo.saveEvent(event);

        // after validation, return the response
        return Promise.resolve(data);
      }
      // validation failed
      return Promise.reject(reason);
    });
  }
};

module.exports = Handler;
