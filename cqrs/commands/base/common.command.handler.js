const fs = require("fs");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const async = require("async");

const CommonCommandHandler = {
  // queue for issuing commands sequentially
  commandQueue: async.queue(function(task, callback) {
    console.log(`Running ${task.commandName}`);
    callback(task.self, task.commandHandler, task.payload);
  }),

  sendCommand(payload, commandName) {
    // get appropriate command handler
    return this.getCommandHandler(commandName).then(commandHandler => {
      // run the functions
      return commandHandler
        .validate(payload)
        .then(valid => {
          // add command to queue
          this.enqueueCommand(commandHandler, commandName, payload);
          return payload;
        })
        .catch(e => {
          return Promise.reject(e);
        });
    });
  },

  enqueueCommand(commandHandler, commandName, payload) {
    let self = this;
    try {
      this.commandQueue.push(
        {
          self: self,
          commandName: commandName,
          commandHandler: commandHandler,
          payload: payload
        },
        // perform command
        function(self, commandHandler, payload) {
          commandHandler.performCommand(payload).then(events => {
            // after the events, send to read and write models
            events.forEach(event => {
              self.sendEvent(event);
              self.addEvent(event);
            });
          });
        }
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  getCommandHandler(commandName) {
    // scan all files in the commands directory
    let files = fs.readdirSync(`/usr/src/app/cqrs/commands/child`);
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      // get command names from each file
      const handler = require(`/usr/src/app/cqrs/commands/child/${files[fileIndex]}`);
      let commandHandler = new handler();
      let commands = commandHandler.getCommands();
      // return command handler if command name found
      if (commands.includes(commandName))
        return Promise.resolve(commandHandler);
    }
    return Promise.reject(constants.COMMAND_NOT_EXISTS);
  },

  getComponent(aggregateName) {
    let componentName = null;
    switch (aggregateName) {
      case constants.USER_AGGREGATE_NAME:
        componentName = constants.USER_COMPONENT;
        break;
      case constants.REPORT_AGGREGATE_NAME:
        componentName = constants.MAP_COMPONENT;
        break;
      case constants.AD_AGGREGATE_NAME:
        componentName = constants.MAP_COMPONENT;
        break;
      case constants.COMMENT_AGGREGATE_NAME:
        componentName = constants.MAP_COMPONENT;
        break;
      case constants.APPLICATION_AGGREGATE_NAME:
        componentName = constants.USER_COMPONENT;
        break;
    }
    return componentName;
  },

  sendEvent(event) {
    // get component name
    const componentName = this.getComponent(event.aggregateName);
    // import the corresponding event handler
    const eventHandler = require(`../../eventListeners/${componentName}/${event.aggregateName}.event.handler`);
    eventHandler.emit(event.eventName, event.payload);
  },

  addEvent(event) {
    // call write repo to save to event store
    writeRepo.saveEvent(event);
  }
};

module.exports = CommonCommandHandler;
