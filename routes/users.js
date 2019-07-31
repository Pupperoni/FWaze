var express = require("express");
var router = express.Router();
var userHandler = require("../controllers/users/users_controller");

// Create new user account
router.post("/new", userHandler.createUser);

/* Login user */
router.post("/login", userHandler.loginUser);

// Edit user account
router.put("/:id/edit", userHandler.updateUser);

// Get single user
router.get("/:id", userHandler.getUserById);

/* GET users listing. */
router.get("/", userHandler.getAllUsers);

module.exports = router;
