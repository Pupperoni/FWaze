const knex = require("../../knex");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
let scanCursor = 0;

function findKey(id) {
  console.log("Current cursor:", scanCursor);

  return Promise.resolve(
    redis.scan(scanCursor, "match", `report:*:${id}`).then(results => {
      // update the cursor
      scanCursor = results[0];
      // the key has been found!
      if (results[1].length > 0) {
        return results[1];
      } else {
        // look for the key again
        return findKey(id);
      }
    })
  );
}

const Handler = {
  createComment(commentData, offset) {
    findKey(commentData.reportId).then(key => {
      redis.hset(key, "offset", offset);
    });

    return knex
      .raw("CALL CreateComment(?,?,?,?,?,?)", [
        commentData.id,
        commentData.userId,
        commentData.userName,
        commentData.reportId,
        commentData.body,
        commentData.timestamp
      ])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getComments() {
    return knex.raw("CALL GetComments").then(row => {
      return Promise.resolve(row[0]);
    });
  },

  getCommentById(commentId) {
    return knex
      .raw("CALL GetCommentById(?)", [commentId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getCommentsByReportId(reportId, pageNum) {
    return knex
      .raw("CALL GetCommentsByReportId(?,?)", [reportId, 5 * pageNum])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getCommentsByReportIdExplain(reportId, pageNum) {
    return knex
      .raw("CALL EGetCommentsByReportId(?,?)", [reportId, 5 * pageNum])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  countCommentsByReportId(reportId) {
    return knex
      .raw("CALL CountCommentsByReportId(?)", [reportId])
      .then(row => {
        return Promise.resolve(row[0][0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getCommentsByUserId(userId) {
    return knex
      .raw("CALL GetCommentsByUserId(?)", [userId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
