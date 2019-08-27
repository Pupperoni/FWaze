const BaseCommandHandler = require("../base/base.command.handler");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const constants = require("../../../constants");

function validateEmail(email) {
  let re = /\S+@\S+/;
  return re.test(email);
}

function UserUpdatedCommandHandler(payload) {
  BaseCommandHandler.call(this, payload);
  this.aggregateName = constants.USER_AGGREGATE_NAME;
  this.eventName = constants.USER_UPDATED;
}

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

UserUpdatedCommandHandler.prototype.validate = function() {
  // validate data sent here
  let valid = true;

  // email valid?
  if (!validateEmail(this.payload.email)) {
    valid = false;
    this.reason = constants.EMAIL_INVALID_FORMAT;
  }
  return Promise.resolve(valid);
};

UserUpdatedCommandHandler.prototype.performCommand = function() {
  // Create event instance
  let event = {
    eventId: shortid.generate(),
    eventName: this.eventName,
    aggregateName: this.aggregateName,
    aggregateID: this.payload.id,
    payload: this.payload
  };
  // check if file was uploaded
  if (this.payload.file) event.payload.avatarPath = this.payload.file.path;

  return Promise.resolve(event);
};

module.exports = UserUpdatedCommandHandler;
