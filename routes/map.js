const express = require('express')
const router = express.Router()
const adHandler = require('../controllers/map/advertisements_controller')
const reportHandler = require('../controllers/map/reports_controller')
const commentHandler = require("../controllers/map/comments_controller")

// Display map
router.get('/', (req, res, next) => {
    res.send("Welcome to map | FWaze")
})

/* ADVERTISEMENTS */

// Get ads by range
router.get('/ads/range', (req, res, next) => { adHandler.getAdsByRange(req, res, next) })

// Get all ads
router.get('/ads', (req, res, next) => { adHandler.getAllAds(req, res, next) })

// Get ad by id
router.get('/ads/:id', (req, res, next) => { adHandler.getAdById(req, res, next) })

// Get ad by user id
router.get('/ads/user/:id', (req, res, next) => { adHandler.getAdByUserId(req, res, next) })

// Add new advertisement
router.post('/ads/new', (req, res, next) => { adHandler.addAd(req, res, next) })

/* REPORTS */

// Get reports by border range (?tleft=50,150&bright=120,100)
router.get('/reports/range', (req, res, next) => { reportHandler.getReportsByRange(req, res, next) })

// Get all reports
router.get('/reports', (req, res, next) => { reportHandler.getAllReports(req, res, next)})

// Get reports by user id
router.get('/reports/user/:id', (req, res, next) => { reportHandler.getReportsByUserId(req, res, next) })

// Get report by report id
router.get('/reports/:id', (req, res, next) => { reportHandler.getReportById(req, res, next)})

// Get reports by type and range
router.get('/reports/type/:type/range', (req, res, next) => { reportHandler.getReportsByTypeRange(req, res, next) })

// Get reports by type
router.get('/reports/type/:type', (req, res, next) => { reportHandler.getReportsByType(req, res, next) })

// New report form
router.get('/reports/new', (req, res, next) => {
    return res.send('Report form here')
})

// Add new report
router.post('/reports/new', (req, res, next) => { reportHandler.addReport(req, res, next)})

/* COMMENTS */

// Get all comments
router.get('/comments', (req, res, next) => {commentHandler.getAllComments(req, res, next)})

// Get comment by id
router.get('/comments/:id', (req, res, next) => {commentHandler.getCommentById(req, res, next)})

// Get comments by report id
router.get('/comments/report/:id', (req, res, next) => {commentHandler.getCommentByReportId(req, res, next)})

// Get comments by user id
router.get('/comments/user/:id', (req, res, next) => {commentHandler.getCommentByUserId(req, res, next)})

// Add new comment
router.post('/comments/new', (req, res, next) => {commentHandler.addComment(req, res, next)})

module.exports = router;