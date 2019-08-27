const BaseCommandHandler = require("../base/base.command.handler");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const constants = require("../../../constants");

function validateEmail(email) {
  let re = /\S+@\S+/;
  return re.test(email);
}

function UserCreatedCommandHandler(payload) {}

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

UserCreatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];
  // passwords match?
  if (payload.password !== payload.confirmPassword) {
    valid = false;
    reasons.push(constants.PASSWORDS_NOT_MATCH);
  }

  // email valid?
  if (!validateEmail(payload.email)) {
    valid = false;
    reasons.push(constants.EMAIL_INVALID_FORMAT);
  }

  if (valid) return Promise.resolve(valid);
  else return Promise.reject(reasons);
};

UserCreatedCommandHandler.prototype.performCommand = function(payload) {
  // generate unique id
  payload.id = shortid.generate();
  // Hash password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(payload.password, salt);
  payload.password = hash;

  // Create event instance
  let event = {
    eventId: shortid.generate(),
    eventName: constants.USER_CREATED,
    aggregateName: constants.USER_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      password: payload.password
    }
  };

  return Promise.resolve(event);
};

module.exports = UserCreatedCommandHandler;
