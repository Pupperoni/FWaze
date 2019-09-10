const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const CONSTANTS = require("../../../constants");
const aggregate = require("../../aggregateHelpers/users/users.aggregate");

function ReportUserNameUpdatedCommandHandler() {}

ReportUserNameUpdatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(
  ReportUserNameUpdatedCommandHandler.prototype,
  "constructor",
  {
    value: ReportUserNameUpdatedCommandHandler,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
  }
);

ReportUserNameUpdatedCommandHandler.prototype.getCommands = function() {
  return [CONSTANTS.COMMANDS.UPDATE_REPORT_USER_NAME];
};

ReportUserNameUpdatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];
  // check type of report
  return Promise.resolve(
    aggregate.getCurrentState(payload.userId).then(user => {
      // user does not exist
      if (!user) {
        valid = false;
        reasons.push(CONSTANTS.ERRORS.USER_NOT_EXISTS);
      }

      if (valid) return Promise.resolve(valid);
      else return Promise.reject(reasons);
    })
  );
};

ReportUserNameUpdatedCommandHandler.prototype.performCommand = function(
  payload
) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: CONSTANTS.EVENTS.REPORT_CREATED,
    aggregateName: CONSTANTS.AGGREGATES.REPORT_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: {
      id: payload.id,
      userId: payload.userId,
      userName: payload.userName,
      latitude: payload.latitude,
      longitude: payload.longitude,
      location: payload.location,
      type: payload.type
    }
  });

  // check if file is uploaded
  if (payload.file) events[0].payload.photoPath = payload.file.path;

  return Promise.resolve(events);
};

module.exports = ReportUserNameUpdatedCommandHandler;
