const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

module.exports = {
  getCurrentState(identifier) {
    // get history of events of report id (TO DO: Get from last snapshot)

    return Promise.resolve(
      redis
        .zrange(
          `events:${constants.REPORT_AGGREGATE_NAME}:${identifier}`,
          0,
          -1
        )
        .then(history => {
          // report has no history yet
          if (history.length === 0) return null;
          let report = {};

          // Recount history
          history.forEach(event => {
            event = JSON.parse(event);
            let payload = event.payload;

            if (event.eventName === constants.REPORT_CREATED) {
              report.id = payload.id;
              report.userId = payload.userId;
              report.userName = payload.userName;
              report.type = payload.type;
              report.latitude = payload.latitude;
              report.longitude = payload.longitude;
              report.location = payload.location;
              // report = payload
            } else if (event.eventName === constants.REPORT_VOTE_CREATED) {
              report.votes++;
              if (!report.voters) report.voters = [];
              report.voters.push(payload.userId);
            } else if (event.eventName === constants.REPORT_VOTE_DELETED) {
              report.votes--;
              // remove the voter
              //   report.voters = report.voters.filter(
              //     voter => voter != payload.userID
              //   );
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
