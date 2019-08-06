const queryHandler = require("../../db/sql/map/advertisements.repository");
const userHandler = require("../../db/sql/users/users.repository");

var shortid = require("shortid");

var Redis = require("ioredis");
var redis = new Redis(process.env.REDIS_URL);
const Handler = {
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

  // Get ads by user id
  getAdsByUserId(req, res, next) {
    userHandler
      .getUserById(req.params.id)
      .then(result => {
        if (!result)
          return res
            .status(400)
            .json({ msg: `User ${req.params.id} does not exist` });
        else {
          queryHandler.getAdByUserId(req.params.id).then(results => {
            if (results.length == 0)
              return res
                .status(400)
                .json({ msg: `User ${req.params.id} had no ads!` });
            return res.json({ ads: results });
          });
        }
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get all ads enclosed in an area
  getAdsByRange(req, res, next) {
    var left = parseInt(req.query.tleft.split(",")[0]);
    var right = parseInt(req.query.bright.split(",")[0]);
    var top = parseInt(req.query.tleft.split(",")[1]);
    var bottom = parseInt(req.query.bright.split(",")[1]);
    queryHandler
      .getAdsByBorder(left, right, bottom, top)
      .then(results => {
        return res.json({ ads: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Add an ad (only for users with role = 1)
  createAd(req, res, next) {
    // Check user role (must be advertiser)
    redis
      .hgetall(`user:${req.body.user_id}`)
      .then(user => {
        if (!user)
          return res.status(400).json({ msg: "This user does not exist!" });
        if (user.role != 1)
          return res
            .status(400)
            .json({ msg: "Sorry. Only advertisers can post advertisements" });

        // Creating ad here
        var newAd = {
          id: shortid.generate(),
          caption: req.body.caption,
          userId: req.body.user_id,
          latitude: req.body.latitude,
          longitude: req.body.longitude
        };

        // Add to redis
        redis.hmset(
          `ad:${newAd.id}`,
          "id",
          newAd.id,
          "caption",
          newAd.caption,
          "user_id",
          newAd.userId,
          "longitude",
          newAd.longitude,
          "latitude",
          newAd.latitude
        );

        // Add to MySQL
        queryHandler
          .createAd(newAd)
          .then(result => {
            return res.json({ msg: "Success!", caption: newAd.caption });
          })
          .catch(e => {
            console.log(e);
            return res.status(400).json({
              msg: "Something went wrong. Check your info and try again."
            });
          });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  }
};

module.exports = Handler;
