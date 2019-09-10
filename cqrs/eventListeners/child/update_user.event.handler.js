const queryHandler = require("../../../db/sql/users/users.repository");
const BaseEventHandler = require("../base/base.event.handler");
const CONSTANTS = require("../../../constants");

function UserUpdatedEventHandler() {}

UserUpdatedEventHandler.prototype = Object.create(BaseEventHandler.prototype);

Object.defineProperty(UserUpdatedEventHandler.prototype, "constructor", {
  value: UserUpdatedEventHandler,
  enumerable: false, // so that it does not appear in 'for in' loop
  writable: true
});

UserUpdatedEventHandler.prototype.getEvents = function() {
  return [CONSTANTS.EVENTS.USER_UPDATED];
};

UserUpdatedEventHandler.prototype.performEvent = function(event) {
  console.log("event received: user updated");
  queryHandler.updateUser(event.payload);

  // create new commands
  let commands = [];

  // // update report user name
  // commands.push({
  //   commandName: CONSTANTS.COMMANDS.UPDATE_REPORT_USER_NAME,
  //   payload: {
  //     userId: event.payload.userId,
  //     userName: event.payload.userName
  //   }
  // });

  // // update ad user name
  // commands.push({
  //   commandName: CONSTANTS.COMMANDS.UPDATE_AD_USER_NAME,
  //   payload: {
  //     userId: event.payload.userId,
  //     userName: event.payload.userName
  //   }
  // });

  return Promise.resolve(commands);
};

module.exports = UserUpdatedEventHandler;
