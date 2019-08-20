const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/comments.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();
const constants = require("../../../constants");

emitter.on(constants.COMMENT_CREATED, function(data) {
  console.log("event received: comment created");
  queryHandler.createComment(data);
});

module.exports = emitter;
