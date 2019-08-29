const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");

function validateEmail(email) {
  let re = /\S+@\S+/;
  return re.test(email);
}

function UserUpdatedCommandHandler() {}

UserUpdatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(UserUpdatedCommandHandler.prototype, "constructor", {
  value: UserUpdatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

UserUpdatedCommandHandler.prototype.getCommands = function() {
  return [
    constants.USER_UPDATED,
    constants.USER_HOME_UPDATED,
    constants.USER_WORK_UPDATED
  ];
};

UserUpdatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];
  // email valid?

  if (payload.email && !validateEmail(payload.email)) {
    valid = false;
    reasons.push(constants.EMAIL_INVALID_FORMAT);
  }
  if (valid) return Promise.resolve(valid);
  else return Promise.reject(reasons);
};

UserUpdatedCommandHandler.prototype.performCommand = function(payload) {
  let events = [];
  // Create event instance
  events.push({
    eventId: shortid.generate(),
    eventName: constants.USER_UPDATED,
    aggregateName: constants.USER_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    }
  });

  // check if file was uploaded
  if (payload.file) events[0].payload.avatarPath = payload.file.path;

  if (
    payload.home.latitude !== "undefined" ||
    payload.home.longitude !== "undefined"
  ) {
    events.push({
      eventId: shortid.generate(),
      eventName: constants.USER_HOME_UPDATED,
      aggregateName: constants.USER_AGGREGATE_NAME,
      aggregateID: payload.id,
      payload: {
        id: payload.id,
        latitude: payload.home.latitude,
        longitude: payload.home.longitude,
        address: payload.home.address
      }
    });
  }
  if (
    payload.work.latitude !== "undefined" ||
    payload.work.longitude !== "undefined"
  )
    events.push({
      eventId: shortid.generate(),
      eventName: constants.USER_WORK_UPDATED,
      aggregateName: constants.USER_AGGREGATE_NAME,
      aggregateID: payload.id,
      payload: {
        id: payload.id,
        latitude: payload.work.latitude,
        longitude: payload.work.longitude,
        address: payload.work.address
      }
    });

  return Promise.resolve(events);
};

module.exports = UserUpdatedCommandHandler;
