const knex = require("../../knex");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const finder = require("../../../utilities");

const Handler = {
  createReport(data, offset) {
    // Add to redis
    if (data.photoPath) {
      redis.hmset(
        `report:${data.userId}:${data.id}`,
        `id`,
        data.id,
        `userId`,
        data.userId,
        `userName`,
        data.userName,
        `longitude`,
        data.longitude,
        `latitude`,
        data.latitude,
        `location`,
        data.location,
        `type`,
        data.type,
        "photoPath",
        data.photoPath,
        "offset",
        offset
      );
    } else {
      redis.hmset(
        `report:${data.userId}:${data.id}`,
        `id`,
        data.id,
        `userId`,
        data.userId,
        `userName`,
        data.userName,
        `longitude`,
        data.longitude,
        `latitude`,
        data.latitude,
        `location`,
        data.location,
        `type`,
        data.type,
        "offset",
        offset
      );
    }

    return knex
      .raw("CALL CreateReport(?,?,?,?)", [
        data.id,
        data.type,
        data.longitude,
        data.latitude
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  addVote(data, offset) {
    finder.findReportQueryKey(data.id).then(key => {
      redis.hset(key, "offset", offset);
    });
    redis.sadd(`user:${data.userId}:upvoting`, data.id);
    redis.sadd(`report:${data.id}:upvoters`, data.userId);
    return knex
      .raw("CALL AddVote(?,?)", [data.id, data.userId])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  removeVote(data, offset) {
    finder.findReportQueryKey(data.id).then(key => {
      redis.hset(key, "offset", offset);
    });
    redis.srem(`user:${data.userId}:upvoting`, data.id);
    redis.srem(`report:${data.id}:upvoters`, data.userId);
    return knex
      .raw("CALL RemoveVote(?,?)", [data.id, data.userId])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getUserVotePair(reportId, userId) {
    return knex
      .raw("CALL GetUserVotePair(?,?)", [reportId, userId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAllReports() {
    return knex
      .raw("CALL GetAllReports()")
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByType(type) {
    return knex
      .raw("CALL GetReportsByType(?)", [type])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportById(reportId) {
    return knex
      .raw("CALL GetReportById(?)", [reportId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByBorder(xl, xu, yl, yu) {
    return knex
      .raw("CALL GetReportsByBorder(?,?,?,?)", [xl, xu, yl, yu])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByBorderExplain(xl, xu, yl, yu) {
    return knex
      .raw("CALL EGetReportsByBorder(?,?,?,?)", [xl, xu, yl, yu])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByTypeBorder(type, xl, xu, yl, yu) {
    return knex
      .raw("CALL GetReportsByTypeBorder(?,?,?,?,?)", [type, xl, xu, yl, yu])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByTypeBorderExplain(type, xl, xu, yl, yu) {
    return knex
      .raw("CALL EGetReportsByTypeBorder(?,?,?,?,?)", [type, xl, xu, yl, yu])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
