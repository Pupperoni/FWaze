const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

module.exports = {
  getCurrentState(id) {
    // get history of events of application id

    let application = {};
    let lastOffset = 0;
    return Promise.resolve(
      // check if snapshot exists
      redis
        .hgetall(`snapshot:${constants.APPLICATION_AGGREGATE_NAME}:${id}`)
        .then(snapshot => {
          // snapshot exists - start here
          if (snapshot.offset && snapshot.currentState) {
            application = JSON.parse(snapshot.currentState);
            lastOffset = parseInt(snapshot.offset) + 1;
          }
          return redis.zrange(
            `events:${constants.APPLICATION_AGGREGATE_NAME}:${id}`,
            lastOffset,
            -1
          );
        })
        .then(history => {
          // Recount history
          console.log(`Start at offset: ${lastOffset}`);
          console.log("application:");
          console.log(application);
          console.log("History:");
          console.log(history);
          history.forEach(event => {
            event = JSON.parse(event);
            let payload = event.payload;

            switch (event.eventName) {
              case constants.APPLICATION_CREATED:
                application.id = payload.id;
                application.userId = payload.userId;
                application.userName = payload.userName;
                application.timestamp = payload.timestamp;
                application.status = 0;
                break;
              case constants.APPLICATION_APPROVED:
                application.status = 1;
                break;
              case constants.APPLICATION_REJECTED:
                application.status = -1;
                break;
            }
          });

          // application does not exist if it was not created
          if (!application.userId) return null;

          // current state of application
          return application;
        })
    );
  }
};
