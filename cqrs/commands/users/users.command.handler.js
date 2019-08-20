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
    var valid = true;
    if (data.password !== data.confirm_password) valid = false;

    // check if user name and email exists
    // var nameCheck = userAggregate
    //   .getCurrentState(data.name, "name")
    //   .then(user => {
    //     console.log(user);
    //     // user exists with this name
    //     if (user.name == data.name) return Promise.resolve(false);
    //     else return Promise.resolve(true);
    //   });

    // var emailCheck = userAggregate
    //   .getCurrentState(data.email, "email")
    //   .then(user => {
    //     console.log(user);
    //     // user exists with this name
    //     if (user) return Promise.resolve(false);
    //     else return Promise.resolve(true);
    //   });

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
          var event = {
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

          // writeRepo.saveEvent({
          //   eventId: shortid.generate(),
          //   eventName: "USER CREATED",
          //   aggregateName: "USERNAME",
          //   aggregateID: data.name,
          //   payload: {
          //     id: data.id,
          //     name: data.name,
          //     email: data.email,
          //     password: data.password,
          //     role: data.role
          //   }
          // });
        });
      });

      // after validation, return the response
      return Promise.resolve(data);
    }

    // validation failed
    return Promise.reject("Invalid data received");
  },

  userUpdated(data, file) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      // Create event instance
      var event = {
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
    return Promise.reject("Invalid data received");
  },

  homeAddressUpdated(data) {
    // validate data sent here
    var valid = true;

    // after validating, do important stuff
    if (valid) {
      // Create event instance
      var event = {
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
    return Promise.reject("Invalid data received");
  },

  workAddressUpdated(data) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      // Create event instance
      var event = {
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
    return Promise.reject("Invalid data received");
  },

  faveRouteCreated(data) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      // Create event instance
      var event = {
        eventId: shortid.generate(),
        eventName: constants.USER_ROUTE_CREATED,
        aggregateName: constants.USER_AGGREGATE_NAME,
        aggregateID: data.id,
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
    return Promise.reject("Invalid data received");
  }
};

module.exports = Handler;
