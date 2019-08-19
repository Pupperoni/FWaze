const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/reports.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("reportCreated", function(data) {
  console.log("event received: report created");
  console.log(data);
});

emitter.on("voteCreated", function(data) {
  console.log("event received: vote created");
  console.log(data);
});

emitter.on("voteDeleted", function(data) {
  console.log("event received: vote deleted");
  console.log(data);
});

module.exports = emitter;
