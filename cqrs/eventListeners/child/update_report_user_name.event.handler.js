const queryHandler = require("../../../db/sql/users/users.repository");
const BaseEventHandler = require("../base/base.event.handler");
const CONSTANTS = require("../../../constants");

function ReportUserNameUpdatedEventHandler() {}

ReportUserNameUpdatedEventHandler.prototype = Object.create(
  BaseEventHandler.prototype
);

Object.defineProperty(
  ReportUserNameUpdatedEventHandler.prototype,
  "constructor",
  {
    value: ReportUserNameUpdatedEventHandler,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
  }
);

ReportUserNameUpdatedEventHandler.prototype.getEvents = function() {
  return [CONSTANTS.EVENTS.REPORT_USER_NAME_UPDATED];
};

ReportUserNameUpdatedEventHandler.prototype.performEvent = function(event) {
  console.log("event received: user updated");
  queryHandler.updateUser(event.payload);

  // create new commands
  let commands = [];

  return Promise.resolve(commands);
};

module.exports = ReportUserNameUpdatedEventHandler;
