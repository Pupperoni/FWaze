const queryHandler = require("../../db/sql/users/users.repository");

var bcrypt = require("bcryptjs");
var Redis = require("ioredis");
var redis = Redis();

var shortid = require("shortid");

const Handler = {
  // Get all user info
  getAllUsers(req, res, next) {
    queryHandler
      .getAllUsers()
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No users found" });
        return res.json({ users: results, sess: req.session });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get user by user id
  getUserById(req, res, next) {
    queryHandler
      .getUserById(req.params.id)
      .then(results => {
        if (!results)
          return res.status(400).json({ msg: "This user does not exist!" });
        return res.json({ user: results, sess: req.session });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Add a new user
  createUser(req, res, next) {
    // Create shortID

    var newMember = {
      id: shortid.generate(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    };

    console.log(`New user ID: ${newMember.id}`);
    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newMember.password, salt, (err, hash) => {
        if (err) throw err;
        newMember.password = hash;
        // Save user to MySQL DB
        queryHandler
          .createUser(newMember)
          .then(result => {
            return res.json({ msg: "Success" });
          })
          .catch(e => {
            return res.status(500).json({ err: e });
          });

        // Save to redis as hash
        // user:${id} = {
        //     id: String,
        //     name: String,
        //     email: String,
        //     password: String,
        //     role: number
        // }

        redis.hmset(
          `user:${newMember.id}`,
          id,
          newMember.id,
          name,
          newMember.name,
          email,
          newMember.email,
          password,
          newMember.password,
          role,
          newMember.role
        );
      });
    });
  },

  // Edit user details
  updateUser(req, res, next) {
    console.log(req.file);
    var memberData = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };
    console.log(memberData);
    queryHandler
      .updateUser(memberData)
      .then(result => {
        return res.json({ msg: "Success" });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
    // // Hash password
    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(memberData.password, salt, (err, hash) => {
    //     if (err) throw err;
    //     memberData.password = hash;
    //     // Save details to DB
    //     queryHandler
    //       .updateUser(memberData)
    //       .then(result => {
    //         return res.json({ msg: "Success", sess: req.session });
    //       })
    //       .catch(e => {
    //         return res.status(500).json({ err: e });
    //       });
    //   });
    // });
  },

  // Log in a user
  loginUser(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;

    if (name && password && name !== "" && password !== "") {
      queryHandler
        .getUserByName(name)
        .then(result => {
          if (!result) {
            return res.status(400).json({ msg: "Login failed" });
          }
          bcrypt.compare(password, result.password).then(isMatch => {
            if (isMatch) {
              return res.json({
                msg: "Login success",
                user: {
                  id: result.id,
                  name: result.name,
                  email: result.email,
                  role: result.role
                }
              });
            } else {
              return res.status(400).json({ msg: "Login failed" });
            }
          });
        })
        .catch(e => {
          return res.status(500).json({ err: e });
        });
    } else {
      return res.status(400).json({ msg: "Missing or invalid details" });
    }
  }
};

module.exports = Handler;
