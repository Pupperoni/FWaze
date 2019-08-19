const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const eventHandler = require("../../eventListeners/users/users.event.handler");
const writeRepo = require("../../writeRepositories/users/users.write.repository");
// creates events
const Handler = {
  // Add a new user
  userCreated(data) {
    // validate data sent here
    var valid = true;
    if (data.password !== data.confirm_password) valid = false;

    // generate unique id
    var id = shortid.generate();
    data.id = id;

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
        writeRepo.createUser(event);
      });
    });

    // after validation, return the response
    if (valid) return Promise.resolve(data);
    else return Promise.reject("Invalid data received");
  },

  userUpdated(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("userUpdated", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  },

  homeAddressUpdated(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("homeAddressUpdated", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  },

  workAddressUpdated(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("homeAddressUpdated", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  },

  faveRouteCreated(req, res, next) {
    // validate data sent here
    var valid = true;

    // after validating, return response
    if (valid) {
      res.json({ msg: "Success" });
    } else res.status(400).json({ msg: "Failed" });

    // emit the event after all data is good
    eventHandler.emit("faveRouteUpdated", req.body);

    // save the create event to eventstore
    // redis.zadd("events", 1, req);
  }
};

module.exports = Handler;
