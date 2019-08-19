const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/users/users.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("adCreated", function(data) {
  console.log("event received: ad created");
  console.log(data);
});

module.exports = emitter;
