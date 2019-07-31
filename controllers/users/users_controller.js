const queryHandler = require("../../db/sql/users/users.repository");
const multer = require("multer");
var bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads/profile_pictures");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  }
});

const upload = multer({ storage: storage });

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

  // Edit user details
  updateUser(req, res, next) {
    var memberData = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.file.path,
      role: req.body.role
    };

    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(memberData.password, salt, (err, hash) => {
        if (err) throw err;
        memberData.password = hash;
        // Save details to DB
        queryHandler
          .updateUser(memberData)
          .then(result => {
            return res.json({ msg: "Success", sess: req.session });
          })
          .catch(e => {
            return res.status(500).json({ err: e });
          });
      });
    });
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
