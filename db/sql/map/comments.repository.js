var knex = require("../../knex");

const Handler = {
  createComment(commentData) {
    return knex
      .raw("INSERT INTO comments (user_id, report_id, text) VALUES (?,?,?)", [
        commentData.userId,
        commentData.reportId,
        commentData.text
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getComments() {
    return knex
      .raw("SELECT id, user_id, report_id, text FROM comments")
      .then(row => {
        return Promise.resolve(row[0]);
      });
  },

  getCommentById(commentId) {
    return knex
      .raw("SELECT id, user_id, report_id, text FROM comments WHERE id = ?", [
        commentId
      ])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getCommentsByReportId(reportId) {
    return knex
      .raw(
        "SELECT id, user_id, report_id, text FROM comments WHERE report_id = ?",
        [reportId]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getCommentsByUserId(userId) {
    return knex
      .raw(
        "SELECT id, user_id, report_id, text FROM comments WHERE user_id = ?",
        [userId]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getText(id) {
    return knex
      .raw("SELECT text FROM comments WHERE id = ?", [id])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
