const fs = require("fs");
const writeRepo = require("../../writeRepositories/write.repository");

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
          console.log(event);
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
    return Promise.reject("bruh");
  },

  sendEvent(event) {
    const eventHandler = require(`../../eventListeners/${event.aggregateName}/${event.aggregateName}.event.handler`);

    eventHandler.emit(event.eventName, event.payload);
  },

  addEvent(event) {
    // call write repo to save to event store
    writeRepo.saveEvent(event);
  }
};

module.exports = CommonCommandHandler;
