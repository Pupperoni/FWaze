const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/map/advertisements.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();
const constants = require("../../../constants");

emitter.on(constants.AD_CREATED, function(data) {
  console.log("event received: ad created");
  queryHandler.createAd(data);
});

module.exports = emitter;
