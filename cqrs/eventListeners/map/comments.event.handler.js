const queryHandler = require("../../../db/sql/map/comments.repository");
const CONSTANTS = require("../../../constants");

const eventHandler = {
  sendToReadStore: event => {
    switch (event.eventName) {
      case CONSTANTS.EVENTS.CREATE_COMMENT:
        console.log("event received: comment created");
        queryHandler.createComment(event.payload);
        break;
    }
  }
};

// emitter.on(CONSTANTS.EVENTS.CREATE_COMMENT, function(data) {
//   console.log("event received: comment created");
//   queryHandler.createComment(data);
// });

module.exports = eventHandler;
