const fs = require("fs");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const CommonCommandHandler = {
  sendCommand(payload, commandName) {
    // get appropriate command handler
    return this.getCommandHandler(commandName)
      .then(commandHandler => {
        // run the functions
        return commandHandler.commandChain(payload);
      })
      .then(events => {
        // after the events, send to read and write models
        events.forEach(event => {
          this.sendEvent(event);
          this.addEvent(event);
        });

        return events[0].payload;
      });
  },

  getCommandHandler(commandName) {
    // scan all files in the commands directory
    let files = fs.readdirSync(`/usr/src/app/cqrs/commands/child`);
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      // get command names from each file
      const handler = require(`/usr/src/app/cqrs/commands/child/${files[fileIndex]}`);
      let commandHandler = new handler();
      let commands = commandHandler.getCommands();
      for (let i = 0; i < commands.length; i++) {
        if (commands[i] === commandName) {
          return Promise.resolve(commandHandler);
        }
      }
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
    }
    return componentName;
  },

  sendEvent(event) {
    const componentName = this.getComponent(event.aggregateName);
    const eventHandler = require(`../../eventListeners/${componentName}/${event.aggregateName}.event.handler`);

    eventHandler.emit(event.eventName, event.payload);
  },

  addEvent(event) {
    // call write repo to save to event store
    writeRepo.saveEvent(event);
  }
};

module.exports = CommonCommandHandler;
