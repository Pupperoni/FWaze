const shortid = require("shortid");
const eventHandler = require("../../eventListeners/map/comments.event.handler");
const reportAggregate = require("../../aggregateHelpers/map/reports.aggregate");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const Handler = {
  // create a report
  commentCreated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // check if report and user exists
    return reportAggregate
      .getCurrentState(data.reportId) // check if report exists
      .then(report => {
        if (!report) {
          // report does not exist
          valid = false;
          reason = constants.REPORT_NOT_EXISTS;
          return Promise.reject(reason);
        } else return userAggregate.getCurrentState(data.userId); // check if user exists
      })
      .then(user => {
        if (!user) {
          valid = false;
          reason = constants.USER_NOT_EXISTS;
          return Promise.reject(reason);
        }

        // if all tests pass, do important stuff
        if (valid) {
          // generate id
          data.id = shortid.generate();

          // Create event instance
          let event = {
            id: shortid.generate(),
            eventName: constants.COMMENT_CREATED,
            aggregateName: constants.COMMENT_AGGREGATE_NAME,
            aggregateID: data.id,
            payload: {
              id: data.id,
              userId: data.userId,
              userName: data.userName,
              reportId: data.reportId,
              body: data.body,
              timestamp: data.timestamp
            }
          };

          // emit the event after all data is good
          eventHandler.emit(constants.COMMENT_CREATED, event.payload);

          // save the create event to eventstore
          writeRepo.saveEvent(event);

          // return response
          return Promise.resolve(data);
        }
      })
      .catch(e => {
        // validation failed
        return Promise.reject(e);
      });
  }
};

module.exports = Handler;
