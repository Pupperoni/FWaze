const queryHandler = require("../../../db/sql/users/users.repository");
const BaseEventHandler = require("../base/base.event.handler");
const CONSTANTS = require("../../../constants");

function AdUserNameUpdatedEventHandler() {}

AdUserNameUpdatedEventHandler.prototype = Object.create(
  BaseEventHandler.prototype
);

Object.defineProperty(AdUserNameUpdatedEventHandler.prototype, "constructor", {
  value: AdUserNameUpdatedEventHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

AdUserNameUpdatedEventHandler.prototype.getEvents = function() {
  return [CONSTANTS.EVENTS.AD_USER_NAME_UPDATED];
};

AdUserNameUpdatedEventHandler.prototype.performEvent = function(event) {
  console.log("event received: user updated");
  queryHandler.updateUser(event.payload);

  // create new commands
  let commands = [];

  return Promise.resolve(commands);
};

module.exports = AdUserNameUpdatedEventHandler;
