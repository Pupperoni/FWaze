const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/users/applications.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();
const constants = require("../../../constants");

emitter.on(constants.APPLICATION_CREATED, function(data) {
  console.log("event received: application created");
  queryHandler.createApplication(data);
});

emitter.on(constants.APPLICATION_APPROVED, function(data) {
  console.log("event received: application approved");
  queryHandler.approveApplication(data);
});

emitter.on(constants.APPLICATION_REJECTED, function(data) {
  console.log("event received: application rejected");
  queryHandler.rejectApplication(data);
});

module.exports = emitter;
