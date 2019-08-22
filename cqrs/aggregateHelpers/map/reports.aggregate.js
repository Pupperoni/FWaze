const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

module.exports = {
  getCurrentState(id) {
    // get history of events of report id (TO DO: Get from last snapshot)
    let report = {};
    let lastOffset = 0;
    return Promise.resolve(
      // check if snapshot exists
      redis
        .hgetall(`snapshot:${constants.REPORT_AGGREGATE_NAME}:${id}`)
        .then(snapshot => {
          // snapshot exists - start here
          if (snapshot.offset && snapshot.currentState) {
            report = JSON.parse(snapshot.currentState);
            lastOffset = snapshot.offset + 1;
          }
          return redis.zrange(
            `events:${constants.REPORT_AGGREGATE_NAME}:${id}`,
            lastOffset,
            -1
          );
        })
        .then(history => {
          // report has no history yet
          if (history.length === 0) return null;

          // Recount history
          history.forEach(event => {
            event = JSON.parse(event);
            let payload = event.payload;

            switch (event.eventName) {
              case constants.REPORT_CREATED:
                report.id = payload.id;
                report.userId = payload.userId;
                report.userName = payload.userName;
                report.type = payload.type;
                report.latitude = payload.latitude;
                report.longitude = payload.longitude;
                report.location = payload.location;
                // report = payload
                break;
              case constants.REPORT_VOTE_CREATED:
                report.votes++;
                if (!report.voters) report.voters = [];
                report.voters.push(payload.userId);
                break;
              case constants.REPORT_VOTE_DELETED:
                report.votes--;
                let index = report.voters.indexOf(payload.userId);
                if (index != -1) report.voters.splice(index, 1);
            }
          });

          // report does not exist if it was not created
          if (!report.id) return null;

          // current state of report
          return report;
        })
    );
  }
};
