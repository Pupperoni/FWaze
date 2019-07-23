const express = require("express");
const router = express.Router();
const adHandler = require("../controllers/map/advertisements_controller");
const reportHandler = require("../controllers/map/reports_controller");
const commentHandler = require("../controllers/map/comments_controller");

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

// Get ad by user id
router.get("/ads/user/:id", adHandler.getAdsByUserId);

// Add new advertisement
router.post("/ads/new", adHandler.createAd);

/* REPORTS */

// Get reports by border range (?tleft=50,150&bright=120,100)
router.get("/reports/range", reportHandler.getReportsByRange);

// Get all reports
router.get("/reports", reportHandler.getAllReports);

// Get reports by user id
router.get("/reports/user/:id", reportHandler.getReportsByUserId);

// Get report by report id
router.get("/reports/:id", reportHandler.getReportById);

// Get reports by type and range
router.get("/reports/type/:type/range", reportHandler.getReportsByTypeRange);

// Get reports by type
router.get("/reports/type/:type", reportHandler.getReportsByType);

// New report form
router.get("/reports/new", (req, res, next) => {
  return res.send("Report form here");
});

// Add new report
router.post("/reports/new", reportHandler.createReport);

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
