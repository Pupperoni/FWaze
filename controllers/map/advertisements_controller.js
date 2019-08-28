const queryHandler = require("../../db/sql/map/advertisements.repository");
// const commandHandler = require("../../cqrs/commands/map/advertisements.command.handler");
const CommonCommandHandler = require("../../cqrs/commands/base/common.command.handler");
const constants = require("../../constants");
let Redis = require("ioredis");
let redis = new Redis(process.env.REDIS_URL);
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
          return res.status(400).json({ msg: constants.AD_NOT_EXISTS });
        return res.json({ ad: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all ads enclosed in an area (tright = northeast)
  getAdsByRange(req, res, next) {
    let right = req.query.tright.split(",")[1];
    let left = req.query.bleft.split(",")[1];
    let top = req.query.tright.split(",")[0];
    let bottom = req.query.bleft.split(",")[0];
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
    let right = req.query.tright.split(",")[1];
    let left = req.query.bleft.split(",")[1];
    let top = req.query.tright.split(",")[0];
    let bottom = req.query.bleft.split(",")[0];
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
    let options = {
      root: "/usr/src/app/"
    };
    redis
      .hgetall(`ad:${req.params.id}`)
      .then(ad => {
        if (ad) {
          if (ad.photoPath) return res.sendFile(ad.photoPath, options);
          else return res.json({ msg: constants.FILE_NOT_FOUND });
        } else return res.status(400).json({ msg: constants.AD_NOT_EXISTS });
      })
      .catch(e => {
        return res
          .status(500)
          .json({ msg: constants.DEFAULT_SERVER_ERROR, err: e });
      });
  },

  //
  //  Commands responsibility section
  //

  // Add an ad (only for users with role >= 1)
  createAd(req, res, next) {
    let payload = {
      userId: req.body.userId,
      userName: req.body.userName,
      caption: req.body.caption,
      latitude: req.body.latitude.toString(),
      longitude: req.body.longitude.toString(),
      location: req.body.location,
      file: req.file
    };
    // commandHandler
    //   .adCreated(req.body, req.file)
    CommonCommandHandler.sendCommand(payload, constants.AD_CREATED)
      .then(result => {
        if (result)
          return res.json({ msg: constants.DEFAULT_SUCCESS, data: result });
      })
      .catch(e => {
        console.log(e);
        return res.status(400).json({ err: e });
      });
  }
};

module.exports = Handler;
