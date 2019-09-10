const fs = require("fs");
const CommonCommandHandler = require("../../commands/base/common.command.handler");
const CONSTANTS = require("../../../constants");
const async = require("async");
const broker = require("../../../kafka");

function enqueueEvent(event) {
  CommonEventHandler.eventQueue.push(
    { event: event },
    // perform event
    function(event) {
      CommonEventHandler.sendEvent(event).then(commands => {
        // if there are additional commands, send them to common command handler
        commands.forEach(command => {
          console.log("Doing", command.commandName);
          let commandName = command.commandName;
          let payload = command.payload;
          CommonCommandHandler.sendCommand(payload, commandName).then(
            result => {
              console.log(commandName, "done");
            }
          );
        });
      });
    }
  );
  return Promise.resolve();
}

const CommonEventHandler = {
  // List of event handler instances
  eventHandlerList: {},

  eventQueue: async.queue(function(task, callback) {
    console.log(`Sending ${task.event.eventName}`);
    callback(task.event);
  }),

  // save event handler instances
  initialzeEventHandlers() {
    // scan all files in the event handlers directory
    fs.readdir(`/usr/src/app/cqrs/eventListeners/child`, (err, files) => {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        // get events names from each file
        const handler = require(`/usr/src/app/cqrs/eventListeners/child/${files[fileIndex]}`);
        let eventHandler = new handler();
        let events = eventHandler.getEvents();

        // save the event handler with the event name
        events.forEach(event => {
          this.eventHandlerList[event] = eventHandler;
        });
      }
    });
  },

  // send to actual event handlers
  sendEvent(event) {
    // get appropriate event handler
    return this.getEventHandler(event.eventName).then(eventHandler => {
      // run perform
      return eventHandler.performEvent(event);
    });
  },

  // get event handler with corresponding event name
  getEventHandler(eventName) {
    try {
      // extract the event handler from eventHandlerList using the event name
      let eventHandler = this.eventHandlerList[eventName];
      return Promise.resolve(eventHandler);
    } catch (e) {
      // reject if event name not found
      return Promise.reject(CONSTANTS.ERRORS.COMMAND_NOT_EXISTS);
    }
  }
};

console.log("Initializing Common Event Handler");
CommonEventHandler.initialzeEventHandlers();

broker.eventSubscribe(message => {
  let event = JSON.parse(message.value);
  return enqueueEvent(event);
});

module.exports = CommonEventHandler;
