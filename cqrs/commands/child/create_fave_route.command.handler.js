const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");
const aggregate = require("../../aggregateHelpers/users/users.aggregate");

function RouteCreatedCommandHandler() {}

RouteCreatedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(RouteCreatedCommandHandler.prototype, "constructor", {
  value: RouteCreatedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

RouteCreatedCommandHandler.prototype.getCommands = function() {
  return [constants.USER_ROUTE_CREATED];
};

RouteCreatedCommandHandler.prototype.validate = function(payload) {
  let valid = true;
  let reasons = [];
  return Promise.resolve(
    aggregate.getCurrentState(payload.id).then(user => {
      // user does not exist
      if (!user) {
        valid = false;
        reasons.push(constants.USER_NOT_EXISTS);
      }
      console.log(valid);

      if (valid) {
        return Promise.resolve(valid);
      } else return Promise.reject(reasons);
    })
  );
};

RouteCreatedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.USER_ROUTE_CREATED,
    aggregateName: constants.USER_AGGREGATE_NAME,
    aggregateID: payload.id,
    payload: {
      id: payload.id,
      routeId: shortid.generate(),
      sourceLatitude: payload.sourceLatitude,
      sourceLongitude: payload.sourceLongitude,
      destinationLatitude: payload.destinationLatitude,
      destinationLongitude: payload.destinationLongitude,
      sourceString: payload.sourceString,
      destinationString: payload.destinationString
    }
  });

  return Promise.resolve(events);
};

module.exports = RouteCreatedCommandHandler;
