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
    let reportCheck = reportAggregate.getCurrentState(data.reportId); // check if report exists
    let userCheck = userAggregate.getCurrentState(data.userId); // check if user exists
    return Promise.all([reportCheck, userCheck])
      .then(results => {
        results.forEach(aggregate => {
          if (!aggregate) {
            valid = false;
          }
        });
        // if all tests pass, do important stuff
        if (valid) {
          // generate id
          payload.id = shortid.generate();
          let events = [];
          // Create event instance
          events.push({
            id: shortid.generate(),
            eventName: constants.COMMENT_CREATED,
            aggregateName: constants.COMMENT_AGGREGATE_NAME,
            aggregateID: payload.id,
            payload: payload
          });

          // emit the event after all data is good
          eventHandler.emit(constants.COMMENT_CREATED, event.payload);

          // save the create event to eventstore
          writeRepo.saveEvent(event);

          // return response
          return Promise.resolve(data);
        }

        // validation failed
        return Promise.reject(reason);
      })
      .catch(e => {
        // validation failed
        return Promise.reject(e);
      });
  }
};

module.exports = Handler;
