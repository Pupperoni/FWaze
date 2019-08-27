const shortid = require("shortid");
const eventHandler = require("../../eventListeners/map/reports.event.handler");
const userAggregate = require("../../aggregateHelpers/users/users.aggregate");
const reportAggregate = require("../../aggregateHelpers/map/reports.aggregate");
const writeRepo = require("../../writeRepositories/write.repository");
const constants = require("../../../constants");

const Handler = {
  // create a report
  reportCreated(data, file) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // get role of user and check if advertiser
    return userAggregate.getCurrentState(data.userId).then(user => {
      // user does not exist
      if (!user) {
        valid = false;
        reason = constants.USER_NOT_EXISTS;
      }
      // invalid report type
      if (data.type < 0 || data.type > 8) {
        valid = false;
        reason = constants.INVALID_REPORT_TYPE;
      }

      // continue if all tests pass
      if (valid) {
        // generate unique id
        data.id = shortid.generate();

        // Create event instance
        let event = {
          eventId: shortid.generate(),
          eventName: constants.REPORT_CREATED,
          aggregateName: constants.REPORT_AGGREGATE_NAME,
          aggregateID: data.id,
          payload: {
            id: data.id,
            userId: user.id,
            userName: user.name,
            type: data.type,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
            location: data.location
          }
        };
        // check if file is uploaded
        if (file) event.payload.photoPath = file.path;

        // emit the event and save to read repo
        eventHandler.emit(constants.REPORT_CREATED, event.payload);

        // call write repo to save to event store
        writeRepo.saveEvent(event);

        // after validation, return the response
        return Promise.resolve(data);
      }
      // validation failed
      return Promise.reject(reason);
    });
  },

  voteCreated(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // check if report and user exists
    let reportCheck = reportAggregate.getCurrentState(data.reportId); // check if report exists
    let userCheck = userAggregate.getCurrentState(data.userId); // check if user exists
    return Promise.all([reportCheck, userCheck]).then(results => {
      results.forEach(aggregate => {
        if (!aggregate) {
          valid = false;
        }
      });

      // continue if data is valid
      if (valid) {
        // Create event instance
        let event = {
          eventId: shortid.generate(),
          eventName: constants.REPORT_VOTE_CREATED,
          aggregateName: constants.REPORT_AGGREGATE_NAME,
          aggregateID: data.reportId,
          payload: {
            id: data.reportId,
            userId: data.userId
          }
        };

        // emit the event after all data is good
        eventHandler.emit(constants.REPORT_VOTE_CREATED, event.payload);

        // save the create event to eventstore
        writeRepo.saveEvent(event);

        // after validation, return the response
        return Promise.resolve(data);
      }

      // validation failed
      return Promise.reject(reason);
    });
  },

  voteDeleted(data) {
    // validate data sent here
    let valid = true;
    let reason = constants.DEFAULT_INVALID_DATA;

    // check if report and user exists
    let reportCheck = reportAggregate.getCurrentState(data.reportId); // check if report exists
    let userCheck = userAggregate.getCurrentState(data.userId); // check if user exists
    return Promise.all([reportCheck, userCheck]).then(results => {
      results.forEach(aggregate => {
        if (!aggregate) {
          valid = false;
        }
      });

      if (valid) {
        // Create event instance
        let event = {
          eventId: shortid.generate(),
          eventName: constants.REPORT_VOTE_DELETED,
          aggregateName: constants.REPORT_AGGREGATE_NAME,
          aggregateID: data.reportId,
          payload: {
            id: data.reportId,
            userId: data.userId
          }
        };

        // emit the event after all data is good
        eventHandler.emit(constants.REPORT_VOTE_DELETED, event.payload);

        // save the create event to eventstore
        writeRepo.saveEvent(event);

        // return response
        return Promise.resolve(data);
      }

      // validation failed
      return Promise.reject(reason);
    });
  }
};

module.exports = Handler;
