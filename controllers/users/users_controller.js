const queryHandler = require("../../db/sql/users/users.repository");

var bcrypt = require("bcryptjs");

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
    queryHandler
      .getUserById(req.params.id)
      .then(results => {
        if (!results)
          return res.status(400).json({ msg: "This user does not exist!" });
        return res.json(results);
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Add a new user
  createUser(req, res, next) {
    var newMember = {
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
        // Save user to DB
        queryHandler
          .createUser(newMember)
          .then(result => {
            return res.json({ msg: "Success" });
          })
          .catch(e => {
            return res.status(500).json({ err: e });
          });
      });
    });
  },

  // Log in a user
  loginUser(req, res, next) {}
};

module.exports = Handler;
