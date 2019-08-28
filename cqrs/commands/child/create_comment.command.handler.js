const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const reportAggregate = require("../../aggregateHelpers/map/reports.aggregate");

function CommentCreatedCommandHandler() {}

CommentCreatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(CommentCreatedCommandHandler.prototype, "constructor", {
  value: CommentCreatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

CommentCreatedCommandHandler.prototype.getCommands = function() {
  return [constants.COMMENT_CREATED];
};

CommentCreatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];
  // check type of report
  let reportCheck = reportAggregate
    .getCurrentState(payload.reportId) // check if report exists
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

CommentCreatedCommandHandler.prototype.performCommand = function(payload) {
  // generate unique id
  payload.id = shortid.generate();

  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.COMMENT_CREATED,
    aggregateName: constants.COMMENT_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: payload
  });

  return Promise.resolve(events);
};

module.exports = CommentCreatedCommandHandler;
