const queryHandler = require("../../../db/sql/users/users.repository");
const BaseEventHandler = require("../base/base.event.handler");
const CONSTANTS = require("../../../constants");

function UpdateUserHomeEventHandler() {}

UpdateUserHomeEventHandler.prototype = Object.create(
  BaseEventHandler.prototype
);

Object.defineProperty(UpdateUserHomeEventHandler.prototype, "constructor", {
  value: UpdateUserHomeEventHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

UpdateUserHomeEventHandler.prototype.getEvents = function() {
  return [CONSTANTS.EVENTS.USER_HOME_UPDATED];
};

UpdateUserHomeEventHandler.prototype.performEvent = function(event) {
  console.log("event received: user home updated");
  queryHandler.setHomeAd(event.payload);

  // create new commands
  let commands = [];

  return Promise.resolve(commands);
};

module.exports = UpdateUserHomeEventHandler;
