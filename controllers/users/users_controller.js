const queryHandler = require("../../db/sql/users/users.repository");

var bcrypt = require("bcryptjs");
var shortid = require("shortid");

var Redis = require("ioredis");
var redis = new Redis(process.env.REDIS_URL);

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

  // Set user's home address
  addHomeAddress(req, res, next) {
    if (!req.body.submit) {
      return res.json({ data: "Request cancelled" });
    }
    redis.hmset(
      `user:${req.body.id}:home`,
      `latitude`,
      req.body.latitude,
      `longitude`,
      req.body.longitude,
      `address`,
      req.body.address
    );

    queryHandler
      .setHomeAd(req.body.id, req.body.address)
      .then(result => {
        return res.json({ data: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Set user's work address
  addWorkAddress(req, res, next) {
    if (!req.body.submit) {
      return res.json({ data: "Request cancelled" });
    }
    redis.hmset(
      `user:${req.body.id}:work`,
      `latitude`,
      req.body.latitude,
      `longitude`,
      req.body.longitude,
      `address`,
      req.body.address
    );

    queryHandler
      .setWorkAd(req.body.id, req.body.address)
      .then(result => {
        return res.json({ data: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Add a new fave route
  createFaveRoute(req, res, next) {
    var routeData = {
      id: shortid.generate(),
      sourceLatitude: req.body.sourceLatitude,
      sourceLongitude: req.body.sourceLongitude,
      destinationLatitude: req.body.destinationLatitude,
      destinationLongitude: req.body.destinationLongitude,
      sourceString: req.body.sourceString,
      destinationString: req.body.destinationString,
      userId: req.body.userId
    };

    queryHandler
      .createFaveRoute(routeData)
      .then(result => {
        console.log(result);
        return res.json({ data: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Add a new fave route
  getFaveRoutes(req, res, next) {
    redis.hgetall(`user:${req.params.id}`).then(user => {
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      queryHandler
        .getFaveRoutes(req.params.id)
        .then(results => {
          console.log(results);
          return res.json({ routes: results });
        })
        .catch(e => {
          console.log(e);
          return res.status(500).json({ err: e });
        });
    });
  },

  // Add a new user
  createUser(req, res, next) {
    var newMember = {
      id: shortid.generate(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    };

    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newMember.password, salt, (err, hash) => {
        if (err) throw err;
        newMember.password = hash;

        // Save to redis as hash
        redis
          .hmset(
            `user:${newMember.id}`,
            `id`,
            newMember.id,
            `name`,
            newMember.name,
            `email`,
            newMember.email,
            `password`,
            newMember.password,
            `role`,
            newMember.role
          )
          .then(() => {
            redis
              .hmset(
                `user:${newMember.id}:home`,
                `latitude`,
                "",
                `longitude`,
                "",
                `address`,
                ""
              )
              .then(() => {
                redis.hmset(
                  `user:${newMember.id}:work`,
                  `latitude`,
                  "",
                  `longitude`,
                  "",
                  `address`,
                  ""
                );
              });
          });

        // To access a user by his name, we store his id somewhere
        redis.set(`user:name:${newMember.name}`, newMember.id);

        // Save user to MySQL DB
        queryHandler
          .createUser(newMember)
          .then(result => {
            return res.json({ msg: "Success", data: newMember });
          })
          .catch(e => {
            return res.status(500).json({ err: e });
          });
      });
    });
  },

  // Edit user details
  updateUser(req, res, next) {
    var memberData = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    // Update redis data
    if (req.file) {
      redis.hmset(
        `user:${memberData.id}`,
        "name",
        memberData.name,
        "email",
        memberData.email,
        "role",
        memberData.role,
        "avatarPath",
        `${req.file.path}`
      );
    } else {
      redis.hmset(
        `user:${memberData.id}`,
        "name",
        memberData.name,
        "email",
        memberData.email,
        "role",
        memberData.role
      );
    }

    // Update MySQL data
    queryHandler
      .updateUser(memberData)
      .then(result => {
        return res.json({ msg: "Success", data: memberData });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
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
                    console.log(work);
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
  }
};

module.exports = Handler;
