const BaseCommandHandler = require("../base/base.command.handler");
const shortid = require("shortid");
const constants = require("../../../constants");
const aggregate = require("../../aggregateHelpers/users/users.aggregate");

function RouteDeletedCommandHandler() {}

RouteDeletedCommandHandler.prototype = Object.create(
  BaseCommandHandler.prototype
);

Object.defineProperty(RouteDeletedCommandHandler.prototype, "constructor", {
  value: RouteDeletedCommandHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

RouteDeletedCommandHandler.prototype.getCommands = function() {
  return [constants.USER_ROUTE_DELETED];
};

RouteDeletedCommandHandler.prototype.validate = function(payload) {
  let valid = true;
  let reasons = [];
  return Promise.resolve(
    aggregate.getCurrentState(payload.userId).then(user => {
      // user does not exist
      if (!user) {
        valid = false;
        reasons.push(constants.USER_NOT_EXISTS);
      }
      // route doesnt belong to user
      else if (!user.faveRoutes.includes(payload.routeId)) {
        valid = false;
        reasons.push(constants.USER_NOT_PERMITTED);
      }
      if (valid) {
        return Promise.resolve(valid);
      } else return Promise.reject(reasons);
    })
  );
};

RouteDeletedCommandHandler.prototype.performCommand = function(payload) {
  // Create event instance
  let events = [];
  events.push({
    eventId: shortid.generate(),
    eventName: constants.USER_ROUTE_DELETED,
    aggregateName: constants.USER_AGGREGATE_NAME,
    aggregateID: payload.userId,
    payload: {
      id: payload.userId,
      routeId: payload.routeId
    }
  });

  return Promise.resolve(events);
};

module.exports = RouteDeletedCommandHandler;
