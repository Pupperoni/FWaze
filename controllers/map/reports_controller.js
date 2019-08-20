const queryHandler = require("../../db/sql/map/reports.repository");
const userHandler = require("../../db/sql/users/users.repository");
const commandHandler = require("../../cqrs/commands/map/reports.command.handler");
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
  //
  // Query responsibility
  //

  // Get all reports
  getAllReports(req, res, next) {
    queryHandler
      .getAllReports()
      .then(results => {
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
          console.log(result);
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
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getReportsByBorder(left, right, bottom, top)
      .then(results => {
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all reports enclosed in an area
  getReportsByRangeExplain(req, res, next) {
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getReportsByBorderExplain(left, right, bottom, top)
      .then(results => {
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all reports enclosed in an area of a specific type
  getReportsByTypeRange(req, res, next) {
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getReportsByTypeBorder(
        reportTypes[req.params.type],
        left,
        right,
        bottom,
        top
      )
      .then(results => {
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all reports enclosed in an area of a specific type
  getReportsByTypeRangeExplain(req, res, next) {
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getReportsByTypeBorderExplain(
        reportTypes[req.params.type],
        left,
        right,
        bottom,
        top
      )
      .then(results => {
        return res.json({ reports: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get vote count
  getVoteCount(req, res, next) {
    // count number of votes in a report
    redis.scard(`report:${req.params.id}:upvoters`).then(count => {
      return res.json({ result: count });
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
        return res.status(500).json({ err: e });
      });
  },

  // Get profile picture of a report
  getImage(req, res, next) {
    var options = {
      root: "/usr/src/app/"
    };
    redis
      .hgetall(`report:${req.params.id}`)
      .then(ad => {
        if (ad) {
          if (ad.photoPath) return res.sendFile(ad.photoPath, options);
          else return res.json({ msg: "No file found" });
        } else return res.status(400).json({ msg: "Ad does not exist" });
      })
      .catch(e => {
        return res.status(500).json({ msg: "Error occurred", err: e });
      });
  },

  //
  //  Command responsibility section
  //

  // Add a new report
  createReport(req, res, next) {
    commandHandler.reportCreated(req.body, req.file).then(result => {
      if (result) return res.json({ msg: "Success", data: result });
      else return res.status(400).json({ msg: "Failed" });
    });
  },
  // Add vote instance
  addVote(req, res, next) {
    commandHandler.voteCreated(req.body).then(result => {
      if (result) return res.json({ msg: "Success", data: result });
      else return res.status(400).json({ msg: "Failed" });
    });
  },

  // Remove vote instance
  deleteVote(req, res, next) {
    commandHandler.voteDeleted(req.body).then(result => {
      if (result) return res.json({ msg: "Success", data: result });
      else return res.status(400).json({ msg: "Failed" });
    });
  }
};

module.exports = Handler;
