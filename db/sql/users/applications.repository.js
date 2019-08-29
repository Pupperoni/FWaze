let knex = require("../../knex");

const Handler = {
  // Create an application
  createApplication(applicationData) {
    return knex
      .raw("CALL CreateApplication(?,?,?,?)", [
        applicationData.id,
        applicationData.userId,
        applicationData.userName,
        applicationData.timestamp
      ])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },
  // Get all applications
  getAllApplications() {
    return knex
      .raw("CALL GetAllApplications()")
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Get all pending applications
  getPendingApplications() {
    return knex
      .raw("CALL GetPendingApplications()")
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Get all pending applications
  approveApplication(data) {
    return knex
      .raw("CALL ApproveApplication(?)", data.userId)
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Get all pending applications
  rejectApplication(data) {
    return knex
      .raw("CALL RejectApplication(?)", data.userId)
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
