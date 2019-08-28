const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");
// will fix
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const applicationAggregate = require("../../aggregateHelpers/users/applications.aggregate");

function ApplicationCreatedCommandHandler() {}

ApplicationCreatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(
  ApplicationCreatedCommandHandler.prototype,
  "constructor",
  {
    value: ApplicationCreatedCommandHandler,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
  }
);

ApplicationCreatedCommandHandler.prototype.getCommands = function() {
  return [constants.APPLICATION_CREATED];
};

ApplicationCreatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];

  // get role of user and check if regular
  return Promise.resolve(
    userAggregate
      .getCurrentState(payload.userId)
      .then(user => {
        // user does not exist
        if (!user) {
          valid = false;
          reasons.push(constants.USER_NOT_EXISTS);
        }
        // user is not regular (not valid)
        else if (user.role != 0) {
          valid = false;
          reasons.push(constants.USER_NOT_PERMITTED);
        }
        if (valid) {
          return applicationAggregate.getCurrentState(payload.userId);
        } else return Promise.reject(reasons);
      })
      .then(application => {
        // application exists already, cant have more than 1
        if (application) {
          valid = false;
          reasons.push(constants.DUPLICATE_APPLICATION);
        }
        if (valid) return Promise.resolve(valid);
        else return Promise.reject(reasons);
      })
  );
};

ApplicationCreatedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.APPLICATION_CREATED,
    aggregateName: constants.APPLICATION_AGGREGATE_NAME,
    aggregateID: payload.userId,
    payload: payload
  });

  return Promise.resolve(events);
};

module.exports = ApplicationCreatedCommandHandler;
