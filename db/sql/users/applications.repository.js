const knex = require("../../knex");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

const Handler = {
  // Create an application
  createApplication(data) {
    redis.hmset(
      `application:${data.id}`,
      `userId`,
      data.userId,
      `userName`,
      data.userName,
      `status`,
      0,
      `timestamp`,
      data.timestamp
    );

    redis.set(`user:${data.userId}:application`, data.id);

    return knex
      .raw("CALL CreateApplication(?,?,?,?)", [
        data.id,
        data.userId,
        data.userName,
        data.timestamp
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
    redis.hmset(`application:${data.userId}`, `status`, 1);

    redis.del(`user:${data.userId}:application`);
    return knex
      .raw("CALL ApproveApplication(?)", [data.userId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Get all pending applications
  rejectApplication(data) {
    redis.hmset(`application:${data.userId}`, `status`, -1);
    redis.del(`user:${data.userId}:application`);
    return knex
      .raw("CALL RejectApplication(?)", [data.userId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
