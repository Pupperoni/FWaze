const queryHandler = require("../../../db/sql/map/reports.repository");
const CONSTANTS = require("../../../constants");

const eventHandler = {
  sendToReadStore: event => {
    switch (event.eventName) {
      case CONSTANTS.EVENTS.CREATE_REPORT:
        console.log("event received: report created");
        queryHandler.createReport(event.payload);
        break;
      case CONSTANTS.EVENTS.CREATE_REPORT_VOTE:
        console.log("event received: vote created");
        queryHandler.addVote(event.payload);
        break;
      case CONSTANTS.EVENTS.DELETE_REPORT_VOTE:
        console.log("event received: vote deleted");
        queryHandler.removeVote(event.payload);
        break;
    }
  }
};

// emitter.on(CONSTANTS.EVENTS.CREATE_REPORT, function(data) {
//   console.log("event received: report created");
//   queryHandler.createReport(data);
// });

// emitter.on(CONSTANTS.EVENTS.CREATE_REPORT_VOTE, function(data) {
//   console.log("event received: vote created");
//   queryHandler.addVote(data);
// });

// emitter.on(CONSTANTS.EVENTS.DELETE_REPORT_VOTE, function(data) {
//   console.log("event received: vote deleted");
//   queryHandler.removeVote(data);
// });

module.exports = eventHandler;
