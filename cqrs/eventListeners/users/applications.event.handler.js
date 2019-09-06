const queryHandler = require("../../../db/sql/users/users.repository");
const CONSTANTS = require("../../../constants");

const eventHandler = {
  sendToReadStore: event => {
    switch (event.eventName) {
      case CONSTANTS.EVENTS.CREATE_APPLICATION:
        console.log("event received: application created");
        queryHandler.createApplication(event.payload);
        break;
      case CONSTANTS.EVENTS.APPROVE_APPLICATION:
        console.log("event received: application approved");
        queryHandler.approveApplication(event.payload);
        break;
      case CONSTANTS.EVENTS.REJECT_APPLICATION:
        console.log("event received: application rejected");
        queryHandler.rejectApplication(event.payload);
        break;
    }
  }
};

// emitter.on(CONSTANTS.EVENTS.CREATE_APPLICATION, function(data) {
//   console.log("event received: application created");
//   queryHandler.createApplication(data);
// });

// emitter.on(CONSTANTS.EVENTS.APPROVE_APPLICATION, function(data) {
//   console.log("event received: application approved");
//   queryHandler.approveApplication(data);
// });

// emitter.on(CONSTANTS.EVENTS.REJECT_APPLICATION, function(data) {
//   console.log("event received: application rejected");
//   queryHandler.rejectApplication(data);
// });

module.exports = eventHandler;
