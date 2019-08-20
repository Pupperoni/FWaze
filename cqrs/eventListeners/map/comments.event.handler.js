const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/comments.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("commentCreated", function(data) {
  console.log("event received: comment created");
  console.log(data);
  queryHandler.createComment(data);
});

module.exports = emitter;
