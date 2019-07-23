var knex = require("../../knex");

const Handler = {
  createReport(reportData) {
    return knex
      .raw(
        "INSERT INTO reports (type, user_id, position) VALUES (?,?,ST_PointFromText('POINT(? ?)'))",
        [
          reportData.type,
          reportData.userId,
          reportData.latitude,
          reportData.longitude
        ]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAllReports() {
    return knex
      .raw("SELECT id, type, votes, position, user_id FROM reports")
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByType(type) {
    return knex
      .raw(
        "SELECT id, type, votes, position, user_id FROM reports WHERE type = ?",
        [type]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByUserId(userId) {
    return knex
      .raw(
        "SELECT id, type, votes, position, user_id FROM reports WHERE user_id = ?",
        [userId]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReporterId(reportId) {
    return knex
      .raw(
        "SELECT users.id FROM reports INNER JOIN users ON reports.user_id = users.id WHERE reports.id = ?",
        [reportId]
      )
      .then(row => {
        return Promise.resolve(row[0][0]);
      });
  },

  getReportById(reportId) {
    return knex
      .raw(
        "SELECT id, type, votes, position, user_id FROM reports WHERE id = ?",
        [reportId]
      )
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  incrementVote(reportId) {
    return knex
      .raw("UPDATE reports SET votes = votes + 1 WHERE id = ?", [reportId])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByBorder(xl, xu, yl, yu) {
    return knex
      .raw(
        "SELECT newpoints.id, newpoints.type, users.id as user_id, newpoints.position FROM (SELECT * FROM reports WHERE ST_Contains(ST_GeomFromText('POLYGON((? ?, ? ?, ? ?, ? ?, ? ?))'), position)) as newpoints INNER JOIN users on newpoints.user_id = users.id",
        [xl, yl, xu, yl, xu, yu, xl, yu, xl, yl]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByTypeBorder(type, xl, xu, yl, yu) {
    return knex
      .raw(
        "SELECT newpoints.id, newpoints.type, users.id as user_id, newpoints.position FROM (SELECT * FROM reports WHERE type = ? and ST_Contains(ST_GeomFromText('POLYGON((? ?, ? ?, ? ?, ? ?, ? ?))'), position)) as newpoints INNER JOIN users on newpoints.user_id = users.id",
        [type, xl, yl, xu, yl, xu, yu, xl, yu, xl, yl]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
