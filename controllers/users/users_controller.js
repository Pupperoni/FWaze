const queryHandler = require("../../db/sql/users/users.repository");
const commandHandler = require("../../cqrs/commands/users/users.command.handler");

var bcrypt = require("bcryptjs");
var shortid = require("shortid");

var Redis = require("ioredis");
var redis = new Redis(process.env.REDIS_URL);

//
// Query responsibility
//

const Handler = {
  // Get all user info
  getAllUsers(req, res, next) {
    queryHandler
      .getAllUsers()
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No users found" });
        return res.json({ users: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get user by user id
  getUserById(req, res, next) {
    // Redis get
    redis
      .hgetall(`user:${req.params.id}`)
      .then(result => {
        if (!result)
          return res.status(400).json({ msg: "This user does not exist!" });
        // Convert string role to int
        result.role = parseInt(result.role);

        // Get home address haha
        redis.hgetall(`user:${req.params.id}:home`).then(home => {
          if (home) result.home = home;
          // Then get work address
          redis.hgetall(`user:${req.params.id}:work`).then(work => {
            if (work) result.work = work;
            return res.json({ user: result });
          });
        });
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
      .hgetall(`user:${req.params.id}`)
      .then(user => {
        if (user) {
          if (user.avatarPath) return res.sendFile(user.avatarPath, options);
          else return res.json({ msg: "No file found" });
        } else return res.status(400).json({ msg: "User does not exist" });
      })
      .catch(e => {
        return res.status(500).json({ msg: "Error occurred", err: e });
      });
  },

  // Add a new fave route
  getFaveRoutes(req, res, next) {
    redis.hgetall(`user:${req.params.id}`).then(user => {
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      queryHandler
        .getFaveRoutes(req.params.id)
        .then(results => {
          return res.json({ routes: results });
        })
        .catch(e => {
          return res.status(500).json({ err: e });
        });
    });
  },

  // Log in a user
  loginUser(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;

    if (name && password && name !== "" && password !== "") {
      redis.get(`user:name:${req.body.name}`).then(userId => {
        if (!userId) return res.status(400).json({ msg: "Login failed" });
        redis
          .hgetall(`user:${userId}`)
          .then(result => {
            bcrypt.compare(password, result.password).then(isMatch => {
              if (isMatch) {
                // Get home address haha
                redis.hgetall(`user:${userId}:home`).then(home => {
                  if (home) result.home = home;
                  // Then get work address
                  redis.hgetall(`user:${userId}:work`).then(work => {
                    if (work) result.work = work;
                    return res.json({
                      msg: "Login success",
                      user: {
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        role: result.role,
                        home: result.home,
                        work: result.work
                      }
                    });
                  });
                });
              } else {
                return res.status(400).json({ msg: "Login failed" });
              }
            });
          })
          .catch(e => {
            return res.status(500).json({ err: e });
          });
      });
    } else {
      return res.status(400).json({ msg: "Login failed" });
    }
  },

  //
  // Commands responsibility section
  //

  // Add a new user
  createUser(req, res, next) {
    commandHandler
      .userCreated(req.body)
      .then(result => {
        if (result) return res.json({ msg: "Success", data: result });
        else return res.status(400).json({ msg: "Failed" });
      })
      .catch(e => {
        return res.status(400).json({ msg: "Failed", err: e });
      });
  },

  // Edit user details
  updateUser(req, res, next) {
    commandHandler
      .userUpdated(req.body, req.file)
      .then(result => {
        if (result) return res.json({ msg: "Success", data: result });
        else return res.status(400).json({ msg: "Failed" });
      })
      .catch(e => {
        return res.status(400).json({ msg: "Failed", err: e });
      });
  },

  // Set user's home address
  addHomeAddress(req, res, next) {
    if (!req.body.submit) return res.json({ data: "Request cancelled" });

    commandHandler
      .homeAddressUpdated(req.body)
      .then(result => {
        if (result) return res.json({ msg: "Success", data: result });
        else return res.status(400).json({ msg: "Failed" });
      })
      .catch(e => {
        return res.status(400).json({ msg: "Failed", err: e });
      });
  },

  // Set user's work address
  addWorkAddress(req, res, next) {
    if (!req.body.submit) return res.json({ data: "Request cancelled" });

    commandHandler
      .workAddressUpdated(req.body)
      .then(result => {
        if (result) return res.json({ msg: "Success", data: result });
        else return res.status(400).json({ msg: "Failed" });
      })
      .catch(e => {
        return res.status(400).json({ msg: "Failed", err: e });
      });
  },

  // Add a new fave route
  createFaveRoute(req, res, next) {
    commandHandler
      .faveRouteCreated(req.body)
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
