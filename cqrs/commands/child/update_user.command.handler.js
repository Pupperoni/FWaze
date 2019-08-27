const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");

function validateEmail(email) {
  let re = /\S+@\S+/;
  return re.test(email);
}

function UserUpdatedCommandHandler(payload) {}

UserUpdatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(UserUpdatedCommandHandler.prototype, "constructor", {
  value: UserUpdatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

UserUpdatedCommandHandler.prototype.getCommands = function() {
  return [constants.USER_UPDATED];
};

UserUpdatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];
  // email valid?
  if (!validateEmail(payload.email)) {
    valid = false;
    reasons.push(constants.EMAIL_INVALID_FORMAT);
  }
  if (valid) return Promise.resolve(valid);
  else return Promise.reject(reasons);
};

UserUpdatedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let event = {
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
  };
  // check if file was uploaded
  if (payload.file) event.payload.avatarPath = payload.file.path;

  return Promise.resolve(event);
};

module.exports = UserUpdatedCommandHandler;
