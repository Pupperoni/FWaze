const BaseCommandHandler = require("../base/base.command.handler");

const shortid = require("shortid");

const eventHandler = require("../../eventListeners/users/users.event.handler");
// const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

function validateEmail(email) {
  let re = /\S+@\S+/;
  return re.test(email);
}

const Handler = {
  userCreated(data) {
    let commandHandler = new UserCreatedCommandHandler(data);
    return commandHandler.run();
  },

  userUpdated(data, file) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;
    // email valid?
    if (!validateEmail(data.email)) {
      valid = false;
      reason = constants.EMAIL_INVALID_FORMAT;
    }

    // after validating, return response
    if (valid) {
      // Create event instance
      let event = {
        eventId: shortid.generate(),
        eventName: constants.USER_UPDATED,
        aggregateName: constants.USER_AGGREGATE_NAME,
        aggregateID: data.id,
        payload: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        }
      };
      // check if file was uploaded
      if (file) event.payload.avatarPath = file.path;

      // call write repo to save to event store
      writeRepo.saveEvent(event);

      // return response
      return Promise.resolve(data);
    }

    // validation failed
    return Promise.reject(reason);
  },

  homeAddressUpdated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // after validating, do important stuff
    if (valid) {
      // Create event instance
      let event = {
        eventId: shortid.generate(),
        eventName: constants.USER_HOME_UPDATED,
        aggregateName: constants.USER_AGGREGATE_NAME,
        aggregateID: data.id,
        payload: {
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address
        }
      };
      // emit the event after all data is good
      eventHandler.emit(constants.USER_HOME_UPDATED, event.payload);

      // save the create event to eventstore
      writeRepo.saveEvent(event);

      // return response
      return Promise.resolve(data);
    }

    // validation failed
    return Promise.reject(reason);
  },

  workAddressUpdated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // after validating, return response
    if (valid) {
      // Create event instance
      let event = {
        eventId: shortid.generate(),
        eventName: constants.USER_WORK_UPDATED,
        aggregateName: constants.USER_AGGREGATE_NAME,
        aggregateID: data.id,
        payload: {
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address
        }
      };

      // emit the event after all data is good
      eventHandler.emit(constants.USER_WORK_UPDATED, event.payload);

      // save the create event to eventstore
      writeRepo.saveEvent(event);

      // return response
      return Promise.resolve(data);
    }
    return Promise.reject(reason);
  },

  faveRouteCreated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // after validating, return response
    if (valid) {
      // Create event instance
      let event = {
        eventId: shortid.generate(),
        eventName: constants.USER_ROUTE_CREATED,
        aggregateName: constants.USER_AGGREGATE_NAME,
        aggregateID: data.userId,
        payload: {
          id: data.userId,
          routeId: shortid.generate(),
          sourceLatitude: data.sourceLatitude,
          sourceLongitude: data.sourceLongitude,
          destinationLatitude: data.destinationLatitude,
          destinationLongitude: data.destinationLongitude,
          sourceString: data.sourceString,
          destinationString: data.destinationString
        }
      };

      // emit the event after all data is good
      eventHandler.emit(constants.USER_ROUTE_CREATED, event.payload);

      // save the create event to eventstore
      writeRepo.saveEvent(event);

      // return response
      return Promise.resolve(data);
    }
    return Promise.reject(reason);
  }
};

module.exports = Handler;
