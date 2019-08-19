const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/reports.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("commentCreated", function(data) {
  console.log("event received: comment created");
  console.log(data);
});

module.exports = emitter;
