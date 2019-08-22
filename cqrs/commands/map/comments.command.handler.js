const shortid = require("shortid");
const eventHandler = require("../../eventListeners/map/comments.event.handler");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const Handler = {
  // create a report
  commentCreated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // check if report and user exists

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

    // validation failed
    return Promise.reject(reason);
  }
};

module.exports = Handler;
