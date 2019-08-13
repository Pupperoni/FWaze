var knex = require("../../knex");

const Handler = {
  createComment(commentData) {
    return knex
      .raw("CALL CreateComment(?,?,?,?)", [
        commentData.id,
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
      .raw(
        "SELECT comments.id, user_id, users.name report_id, text FROM comments INNER JOIN users ON user_id = users.id WHERE comments.id = ?",
        [commentId]
      )
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getCommentsByReportId(reportId) {
    return knex
      .raw("CALL GetCommentsByReportId(?)", [reportId])
      .then(row => {
        return Promise.resolve(row[0][0]);
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
