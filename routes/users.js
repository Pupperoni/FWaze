var express = require("express");
var router = express.Router();
var userHandler = require("../controllers/users/users_controller");

// User creation form
router.get("/new", (req, res, next) => {
  res.send("New user form here");
});

// Create new user account
router.post("/new", userHandler.createUser);

// Edit user account
router.put("/:id/edit", userHandler.updateUser);

/* GET login form. */
router.get("/login", function(req, res, next) {
  res.send("Insert form here");
});

// Get single user
router.get("/:id", userHandler.getUserById);

/* GET users listing. */
router.get("/", userHandler.getAllUsers);

module.exports = router;
