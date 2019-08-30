const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/reports.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();
const constants = require("../../../constants");

emitter.on(constants.REPORT_CREATED, function(data) {
  console.log("event received: report created");
  queryHandler.createReport(data);
});

emitter.on(constants.REPORT_VOTE_CREATED, function(data) {
  console.log("event received: vote created");
  queryHandler.addVote(data);
});

emitter.on(constants.REPORT_VOTE_DELETED, function(data) {
  console.log("event received: vote deleted");
  queryHandler.removeVote(data);
});

module.exports = emitter;
