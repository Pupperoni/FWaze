const fs = require("fs");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");
const kafka = require("kafka-node");

const async = require("async");

// kafka functionality
console.log("Creating client");
const client = new kafka.KafkaClient({
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
});

console.log("Creating consumer");
const consumer = new kafka.Consumer(client, [{ topic: "commandQueue" }], {
  autoCommit: false
});

// when consumer receives a message, push it to the command queue
consumer.on("message", message => {
  console.log("Received message");
  // console.log(message);
  // deserialize the message
  let deserialized = JSON.parse(message.value);
  let payload = deserialized.payload;
  let commandName = deserialized.commandName;

  CommonCommandHandler.enqueueCommand(commandName, payload);
});

console.log("Creating producer");
const producer = new kafka.Producer(client);

producer.on("ready", () => {
  console.log("Producer is ready to send messages");
});

const CommonCommandHandler = {
  // List of command handler instances
  commandHandlerList: {},

  // queue for issuing commands sequentially
  commandQueue: async.queue(function(task, callback) {
    console.log(`Running ${task.commandName}`);
    callback(task.self, task.commandName, task.payload);
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
      console.log("Done initializing");
      console.log(this.commandHandlerList);
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

          let messagesToBeSent = [
            {
              topic: "commandQueue",
              messages: JSON.stringify(formattedPayload)
            }
          ];
          producer.send(messagesToBeSent, (err, results) => {});
          return payload;
        })
        .catch(e => {
          return Promise.reject(e);
        });
    });
  },

  // push command and payload to command queue
  enqueueCommand(commandName, payload) {
    let self = this;
    try {
      this.commandQueue.push(
        {
          self: self,
          commandName: commandName,
          payload: payload
        },
        // perform command
        function(self, commandName, payload) {
          let commandHandler = self.commandHandlerList[commandName];
          commandHandler.performCommand(payload).then(events => {
            consumer.commit((err, data) => {
              console.log(data);
              console.log("Consumer committed");
            });
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

  // gets command handler of corresponding command name
  getCommandHandler(commandName) {
    try {
      // extract the command handler from commandHandlerList using the command name
      let commandHandler = this.commandHandlerList[commandName];
      return Promise.resolve(commandHandler);
    } catch (e) {
      // reject if command name not found
      return Promise.reject(constants.COMMAND_NOT_EXISTS);
    }
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

  // send event to read repo
  sendEvent(event) {
    // get component name
    const componentName = this.getComponent(event.aggregateName);
    // import the corresponding event handler
    const eventHandler = require(`../../eventListeners/${componentName}/${event.aggregateName}.event.handler`);
    eventHandler.emit(event.eventName, event.payload);
  },

  // add event to write repo
  addEvent(event) {
    // call write repo to save to event store
    writeRepo.saveEvent(event);
  }
};

console.log("Initializing Common Command Handler");
CommonCommandHandler.initialzeCommandHandlers();

module.exports = CommonCommandHandler;
