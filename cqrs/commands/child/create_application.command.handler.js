const BaseCommandHandler = require("../base/base.command.handler");
const CONSTANTS = require("../../../constants");
const shortid = require("shortid");

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
  return [CONSTANTS.COMMANDS.CREATE_APPLICATION];
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
          reasons.push(CONSTANTS.ERRORS.USER_NOT_EXISTS);
        }
        // user is not regular (not valid)
        else if (user.role != 0) {
          valid = false;
          reasons.push(CONSTANTS.ERRORS.USER_NOT_PERMITTED);
        }
        if (valid) {
          return applicationAggregate.getCurrentState(payload.userId);
        } else return Promise.reject(reasons);
      })
      .then(application => {
        // pending application exists
        if (application) {
          if (application.status && application.status === 0) {
            valid = false;
            reasons.push(CONSTANTS.ERRORS.DUPLICATE_APPLICATION);
          }
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
    eventName: CONSTANTS.EVENTS.APPLICATION_CREATED,
    aggregateName: CONSTANTS.AGGREGATES.APPLICATION_AGGREGATE_NAME,
    aggregateID: payload.userId,
    payload: payload
  });

  return Promise.resolve(events);
};

module.exports = ApplicationCreatedCommandHandler;
