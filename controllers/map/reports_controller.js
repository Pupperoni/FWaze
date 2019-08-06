const queryHandler = require("../../db/sql/map/reports.repository");
const userHandler = require("../../db/sql/users/users.repository");

var shortid = require("shortid");

var Redis = require("ioredis");
var redis = new Redis(process.env.REDIS_URL);
const reportTypes = {
  traffic_jam: 0,
  heavy_traffic_jam: 1,
  police: 2,
  closed_road: 3,
  car_stopped: 4,
  construction: 5,
  minor_accident: 6,
  major_accident: 7,
  others: 8
};

const Handler = {
  // Get all reports
  getAllReports(req, res, next) {
    queryHandler
      .getAllReports()
      .then(results => {
        console.log(results);
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get report by report id
  getReportById(req, res, next) {
    redis
      .hgetall(`report:${req.params.id}`)
      .then(result => {
        if (!result)
          return res.status(400).json({ msg: "This report does not exist!" });

        // count number of votes in a report
        redis.scard(`report:${req.params.id}:upvoters`).then(count => {
          result.votes = count;
          return res.json({ report: result });
        });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all reports of a specific type
  getReportsByType(req, res, next) {
    queryHandler
      .getReportsByType(reportTypes[req.params.type])
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No reports of this type." });
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all reports enclosed in an area
  getReportsByRange(req, res, next) {
    var left = parseInt(req.query.tleft.split(",")[0]);
    var right = parseInt(req.query.bright.split(",")[0]);
    var top = parseInt(req.query.tleft.split(",")[1]);
    var bottom = parseInt(req.query.bright.split(",")[1]);
    queryHandler
      .getReportsByBorder(left, right, bottom, top)
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No reports found." });
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all reports enclosed in an area of a specific type
  getReportsByTypeRange(req, res, next) {
    var left = parseInt(req.query.tleft.split(",")[0]);
    var right = parseInt(req.query.bright.split(",")[0]);
    var top = parseInt(req.query.tleft.split(",")[1]);
    var bottom = parseInt(req.query.bright.split(",")[1]);
    queryHandler
      .getReportsByTypeBorder(
        reportTypes[req.params.type],
        left,
        right,
        bottom,
        top
      )
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No reports found." });
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Add vote instance
  addVote(req, res, next) {
    // Add to redis
    redis.sadd(`user:${req.body.userId}:upvoting`, req.body.reportId);
    redis.sadd(`report:${req.body.reportId}:upvoters`, req.body.userId);

    // Add to mySQL
    queryHandler
      .addVote(req.body.reportId, req.body.userId)
      .then(results => {
        return res.json({ msg: "Success" });
      })
      .catch(e => {
        console.log(e);
        return res.status(500).json({ err: e });
      });
  },

  // Remove vote instance
  deleteVote(req, res, next) {
    redis.srem(`user:${req.body.userId}:upvoting`, req.body.reportId);
    redis.srem(`report:${req.body.reportId}:upvoters`, req.body.userId);

    queryHandler
      .removeVote(req.body.reportId, req.body.userId)
      .then(results => {
        return res.json({ msg: "Success" });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get vote count
  getVoteCount(req, res, next) {
    queryHandler
      .getVoteCount(req.params.reportId)
      .then(results => {
        return res.json({ votes: results["COUNT(*)"] });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get user and vote report pair
  getUserVotePair(req, res, next) {
    redis
      .sismember(`report:${req.params.reportId}:upvoters`, req.params.userId)
      .then(result => {
        return res.json(result);
      })
      .catch(e => {
        console.log(e);
        return res.status(500).json({ err: e });
      });
  },

  // Add a new report
  createReport(req, res, next) {
    redis.hgetall(`user:${req.body.userId}`).then(user => {
      // Check if user exists
      if (!user) return res.status(400).json({ msg: `User does not exist!` });
      var newReport = {
        id: shortid.generate(),
        type: req.body.type,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      };

      if (newReport.type < 0 || newReport.type > 8)
        return res.status(400).json({ msg: `Invalid type.` });

      // Add to redis
      redis.hmset(
        `report:${newReport.id}`,
        `id`,
        newReport.id,
        `userId`,
        user.id,
        `userName`,
        user.name,
        `longitude`,
        newReport.longitude,
        `latitude`,
        newReport.latitude,
        `type`,
        newReport.type
      );

      // Add to MySQL
      queryHandler
        .createReport(newReport)
        .then(result => {
          return res.json({ msg: "Success", data: newReport });
        })
        .catch(e => {
          return res.status(500).json({ err: e });
        });
    });
  }
};

module.exports = Handler;
