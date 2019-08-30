const EventEmitter = require("events");
const queryHandler = require("../../../db/sql/users/users.repository");
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

const constants = require("../../../constants");

emitter.on(constants.USER_CREATED, function(data) {
  console.log("event received: user created");
  queryHandler.createUser(data);
});

emitter.on(constants.USER_UPDATED, function(data) {
  console.log("event received: user updated");
  queryHandler.updateUser(data);
});

emitter.on(constants.USER_HOME_UPDATED, function(data) {
  console.log("event received: home address updated");
  queryHandler.setHomeAd(data);
});

emitter.on(constants.USER_WORK_UPDATED, function(data) {
  console.log("event received: work address updated");
  queryHandler.setWorkAd(data);
});

emitter.on(constants.USER_ROUTE_CREATED, function(data) {
  console.log("event received: fave route created");
  queryHandler.createFaveRoute(data);
});

emitter.on(constants.USER_ROUTE_DELETED, function(data) {
  console.log("event received: fave route deleted");
  queryHandler.deleteFaveRoute(data);
});

module.exports = emitter;
