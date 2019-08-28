const queryHandler = require("../../db/sql/users/users.repository");
const CommonCommandHandler = require("../../cqrs/commands/base/common.command.handler");
const constants = require("../../constants");

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

//
// Query responsibility
//

const Handler = {
  // Get an application based on user id
  getApplicationByUserId(req, res, next) {
    // Redis get
    redis
      .exists(`application:${req.params.id}`)
      .then(result => {
        if (!result) return res.json({ msg: constants.APPLICATION_NOT_EXISTS });
        return res.json({ data: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },
  // Add a new application for advertiser
  createApplication(req, res, next) {
    const payload = {
      userId: req.body.userId,
      userName: req.body.userName,
      timestamp: req.body.timestamp
    };

    CommonCommandHandler.sendCommand(payload, constants.APPLICATION_CREATED)
      .then(result => {
        return res.json({ msg: constants.DEFAULT_SUCCESS, data: result });
      })
      .catch(e => {
        return res.status(400).json({ err: e });
      });
  }
};

module.exports = Handler;
