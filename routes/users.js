var express = require("express");
const multer = require("multer");

var router = express.Router();
var userHandler = require("../controllers/users/users_controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.id + "-" + Date.now() + ".png");
  }
});

const upload = multer({ storage: storage });

// Create new user account
router.post("/new", userHandler.createUser);

/* Login user */
router.post("/login", userHandler.loginUser);

// Edit user account
router.put("/edit", upload.single("avatar"), userHandler.updateUser);

// Save home address
router.put("/home", userHandler.addHomeAddress);

// Save work address
router.put("/work", userHandler.addWorkAddress);

// Get image of user
router.get("/:id/image", userHandler.getImage);

// Get single user
router.get("/:id", userHandler.getUserById);

/* GET users listing. */
router.get("/", userHandler.getAllUsers);

module.exports = router;
