const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const CONSTANTS = require("../../../constants");
// will fix
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const applicationAggregate = require("../../aggregateHelpers/users/applications.aggregate");

function ApplicationApprovedCommandHandler() {}

ApplicationApprovedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(
  ApplicationApprovedCommandHandler.prototype,
  "constructor",
  {
    value: ApplicationApprovedCommandHandler,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
  }
);

ApplicationApprovedCommandHandler.prototype.getCommands = function() {
  return [CONSTANTS.COMMANDS.APPLICATION_APPROVED];
};

ApplicationApprovedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];

  // get role of user that made the request (should be admin) and check if admin
  return Promise.resolve(
    userAggregate
      .getCurrentState(payload.adminId)
      .then(user => {
        // user does not exist
        if (!user) {
          valid = false;
          reasons.push(CONSTANTS.ERRORS.USER_NOT_EXISTS);
        }
        // should be admin
        else if (user.role != 2) {
          valid = false;
          reasons.push(CONSTANTS.ERRORS.USER_NOT_PERMITTED);
        }
        if (valid) {
          // check if application exists
          return applicationAggregate.getCurrentState(payload.userId);
        } else return Promise.reject(reasons);
      })
      .then(application => {
        // application does not exist; cannot approve
        if (!application) {
          valid = false;
          reasons.push(CONSTANTS.ERRORS.APPLICATION_NOT_EXISTS);
        }
        // application not pending, cannot approve
        else if (application.status !== 0) {
          valid = false;
          reasons.push(CONSTANTS.ERRORS.APPLICATION_NOT_EXISTS);
        }
        if (valid) return Promise.resolve(valid);
        else return Promise.reject(reasons);
      })
  );
};

ApplicationApprovedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: CONSTANTS.EVENTS.APPROVE_APPLICATION,
    aggregateName: CONSTANTS.AGGREGATES.APPLICATION_AGGREGATE_NAME,
    aggregateID: payload.userId,
    payload: {
      id: payload.id,
      userId: payload.userId
    }
  });

  events.push({
    eventId: shortid.generate(),
    eventName: CONSTANTS.EVENTS.UPDATE_USER,
    aggregateName: CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME,
    aggregateID: payload.userId,
    payload: {
      id: payload.userId,
      role: 1
    }
  });

  return Promise.resolve(events);
};

module.exports = ApplicationApprovedCommandHandler;
