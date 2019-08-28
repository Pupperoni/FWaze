const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");
const aggregate = require("../../aggregateHelpers/users/users.aggregate");

function ReportCreatedCommandHandler() {}

ReportCreatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(ReportCreatedCommandHandler.prototype, "constructor", {
  value: ReportCreatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

ReportCreatedCommandHandler.prototype.getCommands = function() {
  return [constants.REPORT_CREATED];
};

ReportCreatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];
  // check type of report
  return Promise.resolve(
    aggregate.getCurrentState(payload.userId).then(user => {
      // user does not exist
      if (!user) {
        valid = false;
        reasons.push(constants.USER_NOT_EXISTS);
      }
      // invalid report type
      if (payload.type < 0 || payload.type > 8) {
        valid = false;
        reasons.push(constants.INVALID_REPORT_TYPE);
      }

      if (valid) return Promise.resolve(valid);
      else return Promise.reject(reasons);
    })
  );
};

ReportCreatedCommandHandler.prototype.performCommand = function(payload) {
  // generate unique id
  payload.id = shortid.generate();

  console.log(payload);

  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.REPORT_CREATED,
    aggregateName: constants.REPORT_AGGREGATE_NAME,
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

module.exports = ReportCreatedCommandHandler;
