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
    kafkaEndPoints.commandConsumer.on("message", message => {
      // deserialize the message
      callback(message).then(() => {
        // commit (assuming everything goes smoothly)
        kafkaEndPoints.commandConsumer.commit((err, data) => {
          // console.log("Committing...");
          console.log(data);
        });
      });
    });
  },

  eventSubscribe(callback) {
    // when consumer receives a message, pass it to event handler
    kafkaEndPoints.eventConsumer.on("message", message => {
      callback(message).then(() => {
        kafkaEndPoints.eventConsumer.commit((err, data) => {
          // console.log("Committing...");
          console.log(data);
        });
      });
    });
  },

  eventSocketsSubscribe(callback) {
    kafkaEndPoints.eventConsumer.on("message", message => {
      callback(message);
    });
  },

  publish: (topic, payload) => {
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
