const queryHandler = require("../../../db/sql/map/advertisements.repository");
const CONSTANTS = require("../../../constants");

const eventHandler = {
  sendToReadStore: event => {
    switch (event.eventName) {
      case CONSTANTS.EVENTS.CREATE_AD:
        console.log("event received: ad created");
        queryHandler.createAd(event.payload);
        break;
    }
  }
};

// emitter.on(CONSTANTS.EVENTS.CREATE_AD, function(data) {
//   console.log("event received: ad created");
//   queryHandler.createAd(data);
// });

module.exports = eventHandler;
