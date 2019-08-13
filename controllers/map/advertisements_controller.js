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

  // Get all ads enclosed in an area (tright = northeast)
  getAdsByRange(req, res, next) {
    var right = req.query.tright.split(",")[1];
    var left = req.query.bleft.split(",")[1];
    var top = req.query.tright.split(",")[0];
    var bottom = req.query.bleft.split(",")[0];
    queryHandler
      .getAdsByBorder(left, right, bottom, top)
      .then(results => {
        return res.json({ ads: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get profile picture of a user
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

  // Add an ad (only for users with role = 1)
  createAd(req, res, next) {
    // Check user role (must be advertiser)
    redis
      .hgetall(`user:${req.body.userId}`)
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
          latitude: req.body.latitude.toString(),
          longitude: req.body.longitude.toString()
        };

        // Add to redis
        if (req.file) {
          redis.hmset(
            `ad:${newAd.id}`,
            "id",
            newAd.id,
            "caption",
            req.body.caption,
            "userId",
            user.id,
            "userName",
            user.name,
            "longitude",
            newAd.longitude,
            "latitude",
            newAd.latitude,
            "photoPath",
            req.file.path
          );
        } else {
          redis.hmset(
            `ad:${newAd.id}`,
            "id",
            newAd.id,
            "caption",
            req.body.caption,
            "userId",
            user.id,
            "userName",
            user.name,
            "longitude",
            newAd.longitude,
            "latitude",
            newAd.latitude
          );
        }

        // Add to MySQL
        queryHandler
          .createAd(newAd)
          .then(result => {
            return res.json({ msg: "Success!", data: newAd });
          })
          .catch(e => {
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
