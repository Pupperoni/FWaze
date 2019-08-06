var knex = require("../../knex");

const Handler = {
  createReport(reportData) {
    return knex
      .raw(
        "INSERT INTO reports (id, type, user_id, position) VALUES (?,?,?,ST_PointFromText('POINT(? ?)'))",
        [
          reportData.id,
          reportData.type,
          reportData.userId,
          reportData.longitude,
          reportData.latitude
        ]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  addVote(reportId, userId) {
    return knex
      .raw("INSERT INTO upvotes (report_id, user_id) VALUES (?, ?)", [
        reportId,
        userId
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  removeVote(reportId, userId) {
    return knex
      .raw("DELETE FROM upvotes WHERE report_id = ? and user_id = ?", [
        reportId,
        userId
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getVoteCount(reportId) {
    return knex
      .raw("SELECT COUNT(*) FROM upvotes WHERE report_id = ?", [reportId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getUserVotePair(reportId, userId) {
    return knex
      .raw("SELECT * FROM upvotes WHERE report_id = ? and user_id = ?", [
        reportId,
        userId
      ])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAllReports() {
    return knex
      .raw(
        // "SELECT reports.id, type, position, user_id, users.name FROM reports INNER JOIN users ON user_id = users.id"
        "SELECT A.id, A.type, A.position, A.user_id, A.name, COUNT(upvotes.report_id) as votes FROM (SELECT reports.id, type, position, user_id, users.name FROM reports INNER JOIN users ON user_id = users.id) as A LEFT JOIN upvotes on A.id = upvotes.report_id GROUP BY id"
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  },

  getReportsByType(type) {
    return knex
      .raw(
        "SELECT reports.id, type, position, user_id, users.name FROM reports INNER JOIN users on user_id = users.id WHERE type = ?",
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
        "SELECT reports.id, type, position, user_id, users.name FROM reports INNER JOIN users ON user_id = users.id WHERE user_id = ?",
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
        "SELECT reports.id, type, position, user_id, users.name FROM reports INNER JOIN users ON user_id = users.id WHERE reports.id = ?",
        [reportId]
      )
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getReportsByBorder(xl, xu, yl, yu) {
    return knex
      .raw(
        "SELECT newpoints.id, newpoints.type, user_id, users.name, newpoints.position FROM (SELECT * FROM reports WHERE ST_Contains(ST_GeomFromText('POLYGON((? ?, ? ?, ? ?, ? ?, ? ?))'), position)) as newpoints INNER JOIN users on newpoints.user_id = users.id",
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
        "SELECT newpoints.id, newpoints.type, user_id, users.name, newpoints.position FROM (SELECT * FROM reports WHERE type = ? and ST_Contains(ST_GeomFromText('POLYGON((? ?, ? ?, ? ?, ? ?, ? ?))'), position)) as newpoints INNER JOIN users on newpoints.user_id = users.id",
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
