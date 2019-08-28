const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");
const reportAggregate = require("../../aggregateHelpers/map/reports.aggregate");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");

function VoteDeletedCommandHandler() {}

VoteDeletedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(VoteDeletedCommandHandler.prototype, "constructor", {
  value: VoteDeletedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

VoteDeletedCommandHandler.prototype.getCommands = function() {
  return [constants.REPORT_VOTE_DELETED];
};

VoteDeletedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];

  let reportCheck = reportAggregate
    .getCurrentState(payload.id) // check if report exists
    .then(report => {
      let subValid = true;
      // report doesn't exist
      if (!report) {
        subValid = false;
        reasons.push(constants.REPORT_NOT_EXISTS);
      }
      return Promise.resolve(subValid);
    });
  let userCheck = userAggregate
    .getCurrentState(payload.userId) // check if user exists
    .then(user => {
      let subValid = true;
      if (!user) {
        subValid = false;
        reasons.push(constants.USER_NOT_EXISTS);
      }
      return Promise.resolve(subValid);
    });

  return Promise.all([reportCheck, userCheck]).then(results => {
    results.forEach(value => {
      // false value found so it must not be valid
      if (!value) valid = value;
    });

    if (valid) Promise.resolve(valid);
    else Promise.reject(reasons);
  });
};

VoteDeletedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.REPORT_VOTE_DELETED,
    aggregateName: constants.REPORT_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: payload
  });

  return Promise.resolve(events);
};

module.exports = VoteDeletedCommandHandler;
