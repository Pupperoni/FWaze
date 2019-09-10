const CONSTANTS = require("../../../constants");

function BaseEventHandler() {}

BaseEventHandler.prototype.getEvents = function() {
  return [];
};

BaseEventHandler.prototype.performEvent = function(event) {
  // do it
  return Promise.resolve(event);
};

module.exports = BaseEventHandler;
