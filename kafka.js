const kafka = require("kafka-node");
const CONSTANTS = require("./constants");

let commandOptions = {
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`, // connect directly to kafka broker (instantiates a KafkaClient)
  batch: undefined, // put client batch settings if you need them
  groupId: "commandGroup",
  sessionTimeout: 15000,
  protocol: ["roundrobin"],
  encoding: "utf8", // default is utf8, use 'buffer' for binary data
  fromOffset: "latest", // default
  commitOffsetsOnFirstJoin: true,
  outOfRangeOffset: "earliest", // default
  onRebalance: (isAlreadyMember, callback) => {
    callback();
  } // or null
};

let eventOptions = {
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`, // connect directly to kafka broker (instantiates a KafkaClient)
  batch: undefined, // put client batch settings if you need them
  groupId: "eventGroup",
  sessionTimeout: 15000,
  protocol: ["roundrobin"],
  encoding: "utf8", // default is utf8, use 'buffer' for binary data
  fromOffset: "latest", // default
  commitOffsetsOnFirstJoin: true,
  outOfRangeOffset: "earliest", // default
  onRebalance: (isAlreadyMember, callback) => {
    callback();
  } // or null
};

const producerClient = new kafka.KafkaClient({
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
});

// const commandClient = new kafka.KafkaClient({
//   kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
// });

// const eventClient = new kafka.KafkaClient({
//   kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
// });

const kafkaEndPoints = {
  commandConsumerGroup: new kafka.ConsumerGroup(
    commandOptions,
    CONSTANTS.TOPICS.COMMAND
  ),

  eventConsumerGroup: new kafka.ConsumerGroup(
    eventOptions,
    CONSTANTS.TOPICS.EVENT
  ),

  producer: new kafka.Producer(producerClient, {
    partitionerType: 3
  })
};

kafkaEndPoints.producer.on("ready", () => {
  console.log("[BROKER] Producer is ready to send messages");
});

const broker = {
  commandSubscribe: callback => {
    kafkaEndPoints.commandConsumerGroup.on("message", message => {
      // deserialize the message
      callback(message).then(() => {
        // commit (assuming everything goes smoothly)
        kafkaEndPoints.commandConsumerGroup.commit((err, data) => {
          // console.log("Committing...");
          console.log("[BROKER] Committing to fwaze_command");
        });
      });
    });
  },

  eventSubscribe(callback) {
    // when consumer receives a message, pass it to event handler
    kafkaEndPoints.eventConsumerGroup.on("message", message => {
      callback(message).then(() => {
        kafkaEndPoints.eventConsumerGroup.commit((err, data) => {
          // console.log("Committing...");
          console.log("[BROKER] Committing to fwaze_event");
        });
      });
    });
  },

  eventSocketsSubscribe(callback) {
    kafkaEndPoints.eventConsumerGroup.on("message", message => {
      callback(message);
    });
  },

  publish: (topic, payload, aggregateId) => {
    let messagesToBeSent = [
      {
        topic: topic,
        messages: JSON.stringify(payload)
      }
    ];
    kafkaEndPoints.producer.send(messagesToBeSent, (err, results) => {});
  }
};

module.exports = broker;
