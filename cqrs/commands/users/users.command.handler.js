const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const eventHandler = require("../../eventListeners/users/users.event.handler");
// const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const Handler = {
  // Add a new user
  userCreated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;
    if (data.password !== data.confirm_password) {
      valid = false;
      reason = constants.PASSWORDS_NOT_MATCH;
    }

    // continue if all tests pass
    if (valid) {
      // generate unique id
      data.id = shortid.generate();

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(data.password, salt, (err, hash) => {
          if (err) throw err;
          // replace plaintext password to hash
          data.password = hash;

          // Create event instance
          let event = {
            eventId: shortid.generate(),
            eventName: constants.USER_CREATED,
            aggregateName: constants.USER_AGGREGATE_NAME,
            aggregateID: data.id,
            payload: {
              id: data.id,
              name: data.name,
              email: data.email,
              password: data.password,
              role: data.role
            }
          };
          // emit the event and save to read repo
          eventHandler.emit(constants.USER_CREATED, event.payload);

          // call write repo to save to event store
          writeRepo.saveEvent(event);
        });
      });

      // after validation, return the response
      return Promise.resolve(data);
    }

    // validation failed
    return Promise.reject(reason);
  },

  userUpdated(data, file) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

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

      // emit the event after all data is good
      eventHandler.emit(constants.USER_UPDATED, event.payload);

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
