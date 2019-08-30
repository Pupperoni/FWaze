const BaseCommandHandler = require("../base/base.command.handler");
const constants = require("../../../constants");
const shortid = require("shortid");
// will fix
const aggregate = require("../../aggregateHelpers/users/users.aggregate");

function AdCreatedCommandHandler() {}

AdCreatedCommandHandler.prototype = Object.create(BaseCommandHandler.prototype);

Object.defineProperty(AdCreatedCommandHandler.prototype, "constructor", {
  value: AdCreatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

AdCreatedCommandHandler.prototype.getCommands = function() {
  return [constants.AD_CREATED];
};

AdCreatedCommandHandler.prototype.validate = function(payload) {
  // validate data sent here
  let valid = true;
  let reasons = [];

  // get role of user and check if advertiser
  return Promise.resolve(
    aggregate.getCurrentState(payload.userId).then(user => {
      // user does not exist
      if (!user) {
        valid = false;
        reasons.push(constants.USER_NOT_EXISTS);
      }
      // user is regular (not valid)
      else if (user.role === "0" || user.role === 0) {
        valid = false;
        reasons.push(constants.USER_NOT_PERMITTED);
      }

      if (valid) return Promise.resolve(valid);
      else return Promise.reject(reasons);
    })
  );
};

AdCreatedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.AD_CREATED,
    aggregateName: constants.AD_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: payload
  });
  // check if file is uploaded
  if (payload.file) events[0].payload.photoPath = payload.file.path;

  return Promise.resolve(events);
};

module.exports = AdCreatedCommandHandler;
