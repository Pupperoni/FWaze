const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const eventHandler = require("../../eventListeners/users/users.event.handler");
const writeRepo = require("../../writeRepositories/users/users.write.repository");

const Handler = {
  // Add a new user
  userCreated(data) {
    // validate data sent here
    var valid = true;
    if (data.password !== data.confirm_password) valid = false;

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
            id: shortid.generate(),
            eventName: "USER CREATED",
            payload: {
              id: data.id,
              name: data.name,
              email: data.email,
              password: data.password,
              role: data.role
            }
          };
          // emit the event and save to read repo
          eventHandler.emit("userCreated", event.payload);

          // call write repo to save to event store
          writeRepo.saveEvent(event);
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
        id: shortid.generate(),
        eventName: "USER UPDATED",
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
      eventHandler.emit("userUpdated", event.payload);

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
        id: shortid.generate(),
        eventName: "USER HOME_UPDATED",
        payload: {
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address
        }
      };
      // emit the event after all data is good
      eventHandler.emit("homeAddressUpdated", event.payload);

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
        id: shortid.generate(),
        eventName: "USER WORK_UPDATED",
        payload: {
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address
        }
      };

      // emit the event after all data is good
      eventHandler.emit("workAddressUpdated", event.payload);

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
        id: shortid.generate(),
        eventName: "USER ROUTE_CREATED",
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
      eventHandler.emit("faveRouteCreated", event.payload);

      // save the create event to eventstore
      writeRepo.saveEvent(event);

      // return response
      return Promise.resolve(data);
    }
    return Promise.reject("Invalid data received");
  }
};

module.exports = Handler;
