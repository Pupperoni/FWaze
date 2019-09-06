const kafka = require("kafka-node");
const CONSTANTS = require("./constants");

const producerClient = new kafka.KafkaClient({
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
});

const commandClient = new kafka.KafkaClient({
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
});

const eventClient = new kafka.KafkaClient({
  kafkaHost: `${process.env.KAFKA_HOST_NAME}:${process.env.KAFKA_PORT}`
});

const kafkaEndPoints = {
  commandConsumer: new kafka.Consumer(
    commandClient,
    [{ topic: CONSTANTS.TOPICS.COMMAND }],
    {
      autoCommit: false
    }
  ),

  eventConsumer: new kafka.Consumer(
    eventClient,
    [{ topic: CONSTANTS.TOPICS.EVENT }],
    {
      autoCommit: false
    }
  ),

  producer: new kafka.Producer(producerClient)
};

kafkaEndPoints.producer.on("ready", () => {
  console.log("Producer is ready to send messages");
});

const broker = {
  commandSubscribe: callback => {
    // when consumer receives a message, push it to the command queue
    kafkaEndPoints.commandConsumer.on("message", message => {
      console.log("Command received");
      // deserialize the message
      let deserialized = JSON.parse(message.value);
      let payload = deserialized.payload;
      let commandName = deserialized.commandName;
      callback(commandName, payload).then(() => {
        // commit (assuming everything goes smoothly)
        kafkaEndPoints.commandConsumer.commit((err, data) => {
          console.log("Committing...");
          console.log(data);
        });
      });
    });
  },

  eventSubscribe: callback => {
    // when consumer receives a message, pass it to event handler
    kafkaEndPoints.eventConsumer.on("message", message => {
      console.log("Event received");
      let event = JSON.parse(message.value);
      callback(event).then(() => {
        kafkaEndPoints.eventConsumer.commit((err, data) => {
          console.log("Committing...");
          console.log(data);
        });
      });
    });
  },

  publish: (topic, payload) => {
    let messagesToBeSent = [
      {
        topic: topic,
        messages: JSON.stringify(payload)
      }
    ];
    console.log("Sending to", messagesToBeSent[0].topic);
    kafkaEndPoints.producer.send(messagesToBeSent, (err, results) => {});
  }
};

module.exports = broker;
