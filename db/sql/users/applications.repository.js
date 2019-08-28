let knex = require("../../knex");

const Handler = {
  // Create an application
  createApplication(applicationData) {
    return knex
      .raw("CALL CreateApplication(?,?,?)", [
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
  }
};

module.exports = Handler;
