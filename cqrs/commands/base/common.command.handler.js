const fs = require("fs");
const writeRepo = require("../../writeRepositories/write.repository");
const CONSTANTS = require("../../../constants");
const async = require("async");
const broker = require("../../../kafka");

const CommonCommandHandler = {
  // List of command handler instances
  commandHandlerList: {},

  commandQueue: async.queue(function(task, callback) {
    console.log(`Running ${task.commandName}`);
    callback(task.commandName, task.payload);
  }),

  // save command handler instances
  initialzeCommandHandlers() {
    // scan all files in the commands directory
    fs.readdir(`/usr/src/app/cqrs/commands/child`, (err, files) => {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        // get command names from each file
        const handler = require(`/usr/src/app/cqrs/commands/child/${files[fileIndex]}`);
        let commandHandler = new handler();
        let commands = commandHandler.getCommands();

        // save the command handler with the command name
        commands.forEach(command => {
          this.commandHandlerList[command] = commandHandler;
        });
      }
    });
  },

  // send command to actual command handlers
  sendCommand(payload, commandName) {
    // get appropriate command handler
    return this.getCommandHandler(commandName).then(commandHandler => {
      // run the functions
      return commandHandler
        .validate(payload)
        .then(valid => {
          // Publish command and payload to kafka
          console.log("Sending...");
          let formattedPayload = {
            payload: payload,
            commandName: commandName
          };
          broker.publish(CONSTANTS.TOPICS.COMMAND, formattedPayload);
          return payload;
        })
        .catch(e => {
          return Promise.reject(e);
        });
    });
  },

  // gets command handler of corresponding command name
  getCommandHandler(commandName) {
    try {
      // extract the command handler from commandHandlerList using the command name
      let commandHandler = this.commandHandlerList[commandName];
      return Promise.resolve(commandHandler);
    } catch (e) {
      // reject if command name not found
      return Promise.reject(CONSTANTS.ERRORS.COMMAND_NOT_EXISTS);
    }
  },

  // send event to read repo
  sendEvent(event) {
    broker.publish(CONSTANTS.TOPICS.EVENT, event);
  },

  // add event to write repo
  addEvent(event) {
    // call write repo to save to event store
    writeRepo.saveEvent(event);
  }
};

console.log("Initializing Common Command Handler");
CommonCommandHandler.initialzeCommandHandlers();

// push command and payload to command queue
function enqueueCommand(commandName, payload) {
  return Promise.resolve(
    CommonCommandHandler.commandQueue.push(
      {
        commandName: commandName,
        payload: payload
      },
      // perform command
      function(commandName, payload) {
        let commandHandler =
          CommonCommandHandler.commandHandlerList[commandName];
        commandHandler.performCommand(payload).then(events => {
          // after the events, send to read and write models
          events.forEach(event => {
            CommonCommandHandler.sendEvent(event);
            CommonCommandHandler.addEvent(event);
          });
        });
      }
    )
  );
}

// Wait for messages
broker.commandSubscribe(message => {
  let deserialized = JSON.parse(message.value);
  let payload = deserialized.payload;
  let commandName = deserialized.commandName;
  return enqueueCommand(commandName, payload);
});

module.exports = CommonCommandHandler;
