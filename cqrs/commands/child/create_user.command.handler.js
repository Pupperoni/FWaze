const BaseCommandHandler = require("../base/base.command.handler");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const constants = require("../../../constants");

function validateEmail(email) {
  let re = /\S+@\S+/;
  return re.test(email);
}

function UserCreatedCommandHandler(payload) {
  BaseCommandHandler.call(this, payload);
  this.aggregateName = constants.USER_AGGREGATE_NAME;
  this.eventName = constants.USER_CREATED;
}

UserCreatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(UserCreatedCommandHandler.prototype, "constructor", {
  value: UserCreatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

UserCreatedCommandHandler.prototype.getCommands = function() {
  return [constants.USER_CREATED];
};

UserCreatedCommandHandler.prototype.validate = function() {
  // validate data sent here
  let valid = true;

  // passwords match?
  if (this.payload.password !== this.payload.confirm_password) {
    valid = false;
    this.reason = constants.PASSWORDS_NOT_MATCH;
  }

  // email valid?
  if (!validateEmail(this.payload.email)) {
    valid = false;
    this.reason = constants.EMAIL_INVALID_FORMAT;
  }
  return Promise.resolve(valid);
};

UserCreatedCommandHandler.prototype.performCommand = function() {
  // generate unique id
  this.payload.id = shortid.generate();

  // Hash password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(this.payload.password, salt);
  this.payload.password = hash;

  // Create event instance
  let event = {
    eventId: shortid.generate(),
    eventName: this.eventName,
    aggregateName: this.aggregateName,
    aggregateID: this.payload.id,
    payload: this.payload
  };

  return Promise.resolve(event);
};

module.exports = UserCreatedCommandHandler;
