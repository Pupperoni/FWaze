var knex = require("../../knex");

const Handler = {
  createReport(reportData) {
    return knex
      .raw("CALL CreateReport(?,?,?,?)", [
        reportData.id,
        reportData.type,
        reportData.longitude,
        reportData.latitude
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  addVote(reportId, userId) {
    return knex
      .raw("CALL AddVote(?,?)", [reportId, userId])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  removeVote(reportId, userId) {
    return knex
      .raw("CALL RemoveVote(?,?)", [reportId, userId])
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
      .raw("CALL GetAllReports()")
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        console.log(e);
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

  getReportsByTypeBorder(type, xl, xu, yl, yu) {
    return knex
      .raw("CALL GetReportsByTypeBorder(?,?,?,?,?)", [type, xl, xu, yl, yu])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
