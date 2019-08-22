const queryHandler = require("../../db/sql/users/users.repository");
const commandHandler = require("../../cqrs/commands/users/users.command.handler");

let bcrypt = require("bcryptjs");

let Redis = require("ioredis");
let redis = new Redis(process.env.REDIS_URL);

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
    let options = {
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
    let name = req.body.name;
    let password = req.body.password;
    let id = null;
    let user = {};

    if (name && password && name !== "" && password !== "") {
      // fields must not be empty
      redis
        .get(`user:name:${req.body.name}`) // check if user exists
        .then(userId => {
          if (!userId) return Promise.reject("Login failed");
          id = userId;
          return redis.hgetall(`user:${userId}`);
        })
        .then(result => {
          user = result;
          return bcrypt.compare(password, result.password); // check if password is correct
        })
        .then(isMatch => {
          if (isMatch) {
            // Get home address haha
            return redis.hgetall(`user:${id}:home`); // get home details
          } else return Promise.reject("Login failed");
        })
        .then(home => {
          if (home) user.home = home;
          // Then get work address
          return redis.hgetall(`user:${id}:work`); // and work details
        })
        .then(work => {
          if (work) user.work = work;
          return res.json({
            msg: "Login success",
            user: user
          });
        })
        .catch(e => {
          console.log(e);
          return res.status(400).json({ msg: e });
        });
    } else return res.status(400).json({ msg: "Login failed" });
  },

  //
  // Commands responsibility section
  //

  // Add a new user
  createUser(req, res, next) {
    // validate user details
    queryHandler
      .getUserByName(req.body.name) // checks name
      .then(user => {
        if (user.length > 0) return Promise.reject("Username already taken");
        else
          return Promise.resolve(queryHandler.getUserByEmail(req.body.email)); // checks email
      })
      .then(user => {
        if (user.length > 0) return Promise.reject("Email already registered");
        else return Promise.resolve(true);
      })
      .then(result => {
        if (result) {
          // all good
          commandHandler.userCreated(req.body).then(result => {
            if (result) return res.json({ msg: "Success", data: result });
            else return res.status(400).json({ msg: "Failed" });
          });
        }
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
