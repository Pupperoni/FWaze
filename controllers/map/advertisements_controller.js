const queryHandler = require("../../db/sql/map/advertisements.repository");
const userHandler = require("../../db/sql/users/users.repository");
const commandHandler = require("../../cqrs/commands/map/advertisements.command.handler");
var shortid = require("shortid");

var Redis = require("ioredis");
var redis = new Redis(process.env.REDIS_URL);
const Handler = {
  //
  //  Query responsibility
  //

  // Get all ads
  getAllAds(req, res, next) {
    queryHandler
      .getAds()
      .then(results => {
        return res.json({ ads: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get ad by ad id
  getAdById(req, res, next) {
    redis
      .hgetall(`ad:${req.params.id}`)
      .then(result => {
        if (!result)
          return res.status(400).json({ msg: "This ad does not exist!" });
        return res.json({ ad: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all ads enclosed in an area (tright = northeast)
  getAdsByRange(req, res, next) {
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getAdsByBorder(left, right, bottom, top)
      .then(results => {
        // console.log(results);
        return res.json({ ads: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all ads enclosed in an area (tright = northeast)
  getAdsByRangeExplain(req, res, next) {
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getAdsByBorderExplain(left, right, bottom, top)
      .then(results => {
        // console.log(results);
        return res.json({ ads: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get profile picture of an ad
  getImage(req, res, next) {
    var options = {
      root: "/usr/src/app/"
    };
    redis
      .hgetall(`ad:${req.params.id}`)
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
  //  Commands responsibility section
  //

  // Add an ad (only for users with role >= 1)
  createAd(req, res, next) {
    commandHandler
      .adCreated(req.body, req.file)
      .then(result => {
        if (result) return res.json({ msg: "Success", data: result });
        else return res.status(400).json({ msg: "Failed" });
      })
      .catch(e => {
        return res.status(400).json({ msg: "Failed", err: e });
      });
  }
};

module.exports = Handler;
