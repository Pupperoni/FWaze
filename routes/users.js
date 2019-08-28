const express = require("express");
const multer = require("multer");

let router = express.Router();
let userHandler = require("../controllers/users/users_controller");
let applicationHandler = require("../controllers/users/applications_controller");

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

// Get fave routes
router.get("/faves/:id", userHandler.getFaveRoutes);

// Add fave route
router.post("/faves/new", userHandler.createFaveRoute);

// Get image of user
router.get("/:id/image", userHandler.getImage);

// Get single user
router.get("/:id", userHandler.getUserById);

/* GET users listing. */
router.get("/", userHandler.getAllUsers);

/* Advertiser Applications */

// Get application by user id
router.get("/apply/:id", applicationHandler.getApplicationByUserId);

// Add new application
router.post("/apply/new", applicationHandler.createApplication);

module.exports = router;
