var knex = require("../../knex");

const Handler = {
  createComment(commentData) {
    return knex
      .raw("CALL CreateComment(?,?,?,?,?)", [
        commentData.id,
        commentData.userId,
        commentData.userName,
        commentData.reportId,
        commentData.body
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
