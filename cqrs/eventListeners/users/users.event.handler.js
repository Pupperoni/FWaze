const queryHandler = require("../../../db/sql/users/users.repository");
const CONSTANTS = require("../../../constants");

const eventHandler = {
  sendToReadStore: event => {
    switch (event.eventName) {
      case CONSTANTS.EVENTS.CREATE_USER:
        console.log("event received: user created");
        queryHandler.createUser(event.payload);
        break;
      case CONSTANTS.EVENTS.UPDATE_USER:
        console.log("event received: user updated");
        queryHandler.updateUser(event.payload);
        break;
      case CONSTANTS.EVENTS.UPDATE_USER_HOME:
        console.log("event received: home address updated");
        queryHandler.setHomeAd(event.payload);
        break;
      case CONSTANTS.EVENTS.UPDATE_USER_WORK:
        console.log("event received: work address updated");
        queryHandler.setWorkAd(event.payload);
        break;
      case CONSTANTS.EVENTS.CREATE_USER_ROUTE:
        console.log("event received: fave route created");
        queryHandler.createFaveRoute(event.payload);
        break;
      case CONSTANTS.EVENTS.DELETE_USER_ROUTE:
        console.log("event received: fave route deleted");
        queryHandler.deleteFaveRoute(event.payload);
        break;
    }
  }
};

// emitter.on(CONSTANTS.EVENTS.CREATE_USER, function(data) {
//   console.log("event received: user created");
//   queryHandler.createUser(data);
// });

// emitter.on(CONSTANTS.EVENTS.UPDATE_USER, function(data) {
//   console.log("event received: user updated");
//   queryHandler.updateUser(data);
// });

// emitter.on(CONSTANTS.EVENTS.UPDATE_USER_HOME, function(data) {
//   console.log("event received: home address updated");
//   queryHandler.setHomeAd(data);
// });

// emitter.on(CONSTANTS.EVENTS.UPDATE_USER_WORK, function(data) {
//   console.log("event received: work address updated");
//   queryHandler.setWorkAd(data);
// });

// emitter.on(CONSTANTS.EVENTS.CREATE_USER_ROUTE, function(data) {
//   console.log("event received: fave route created");
//   queryHandler.createFaveRoute(data);
// });

// emitter.on(CONSTANTS.EVENTS.DELETE_USER_ROUTE, function(data) {
//   console.log("event received: fave route deleted");
//   queryHandler.deleteFaveRoute(data);
// });

module.exports = eventHandler;
