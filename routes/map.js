const express = require("express");
const multer = require("multer");

const router = express.Router();
const adHandler = require("../controllers/map/advertisements_controller");
const reportHandler = require("../controllers/map/reports_controller");
const commentHandler = require("../controllers/map/comments_controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ads/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.userId + "-" + Date.now() + ".png");
  }
});

const upload = multer({ storage: storage });

// Display map
router.get("/", (req, res, next) => {
  res.send("Welcome to map | FWaze");
});

/* ADVERTISEMENTS */

// Get ads by range
router.get("/ads/range", adHandler.getAdsByRange);

// Get all ads
router.get("/ads", adHandler.getAllAds);

// Get ad by id
router.get("/ads/:id", adHandler.getAdById);

// Get ad image
router.get("/ads/:id/image", adHandler.getImage);

// Add new advertisement
router.post("/ads/new", upload.single("photo"), adHandler.createAd);

/* REPORTS */

// Update votes count of report up
router.put("/reports/up", reportHandler.addVote);

// Update votes count of report down
router.put("/reports/down", reportHandler.deleteVote);

// Get vote count
router.get("/reports/:reportId/votes", reportHandler.getVoteCount);

// Get user and vote pair (if exists)
router.get("/reports/:reportId/voted/:userId", reportHandler.getUserVotePair);

// Get reports by border range (?tleft=50,150&bright=120,100)
router.get("/reports/range", reportHandler.getReportsByRange);

// Get report by report id
router.get("/reports/:id", reportHandler.getReportById);

// Get reports by type and range
router.get("/reports/type/:type/range", reportHandler.getReportsByTypeRange);

// Get reports by type
router.get("/reports/type/:type", reportHandler.getReportsByType);

// Add new report
router.post("/reports/new", reportHandler.createReport);

// Get all reports
router.get("/reports", reportHandler.getAllReports);

/* COMMENTS */

// Get all comments
router.get("/comments", commentHandler.getAllComments);

// Get comment by id
router.get("/comments/:id", commentHandler.getCommentById);

// Get comments by report id
router.get("/comments/report/:id", commentHandler.getCommentsByReportId);

// Get comments by user id
router.get("/comments/user/:id", commentHandler.getCommentsByUserId);

// Add new comment
router.post("/comments/new", commentHandler.createComment);

module.exports = router;
