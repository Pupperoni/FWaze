const express = require('express')
const router = express.Router()
const adHandler = require('../db/sql/map/knexadvertisements')
const reportHandler = require('../db/sql/map/knexreports')
const commentHandler = require("../db/sql/map/knexcomments")
const userHandler = require('../db/sql/users/knexusers')

const reportTypes = {
    traffic_jam: 0,
    heavy_traffic_jam: 1,
    police: 2,
    closed_road: 3,
    car_stopped: 4,
    construction: 5,
    minor_accident: 6,
    major_accident: 7
}
// Display map
router.get('/', (req, res, next) => {
    res.send("Welcome to map | FWaze")
})

/* ADVERTISEMENTS */

// Get all ads
router.get('/ads', (req, res, next) => {
    adHandler.getAds()
    .then((results) => {
        return res.json(results)
    })
    .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
})

// Get ad by id
router.get('/ads/:id', (req, res, next) => {
    adHandler.getAdById(req.params.id)
    .then((result) => {
        return res.json(result)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Try again."})})
})

// Get ad by user id
router.get('/ads/user/:id', (req, res, next) => {
    adHandler.getAdByUserId(req.params.id)
    .then((result) => {
        if(result == undefined)
            return res.status(400).json({msg: `User ${req.params.id} had no ads!`})
        return res.json(result)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Try again."})})
})

// Add new advertisement
router.post('/ads/new', (req, res, next) => {
    // Check user role (must be advertiser)
    userHandler.getUserRole(req.body.user_id)
    .then( (result) => {
        var role = result.role
        if(role != 1) return res.status(400).json({msg: "Sorry. Only advertisers can post advertisements."})
    
        // Creating ad here
        var newAd = {
            caption: req.body.caption,
            userId: req.body.user_id,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }

        adHandler.addAd(newAd)
        .then( (result) => {
            return res.json({msg: "Success!", caption: newAd.caption})
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Check your info and try again."})})
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Check your info and try again."})
    })
})

/* REPORTS */

// Get reports by border range (?tleft=50,150&bleft=50,100&tright=120,150&bright=120,100)
router.get('/reports/range', (req, res, next) => {
    var left = parseInt(req.query.tleft.split(",")[0])
    var right = parseInt(req.query.bright.split(",")[0])
    var top = parseInt(req.query.tleft.split(",")[1])
    var bottom = parseInt(req.query.bright.split(",")[1])
    reportHandler.getReportsByBorder(left,right,bottom,top)
    .then((results) => {
        return res.json(results)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Please try again."})
    })
})

// Get all reports
router.get('/reports', (req, res, next) => {
    reportHandler.getAllReports()
    .then((results) => {
        return res.json(results)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Please try again."})
    })
})

// Get report by report id
router.get('/reports/:id', (req, res, next) => {
    reportHandler.getReportById(req.params.id)
    .then((result) => {
        return res.json(result)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Please try again."})
    })
})

// Get reports by type
router.get('/reports/type/:type', (req, res, next) => {
    reportHandler.getReportsByType(reportTypes[req.params.type])
    .then((results) => {
        if(results.length == 0)
            return res.status(400).json({msg: "No reports of this type."})
        return res.json(results)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Please try again."})
    })
})

// New report form
router.get('/reports/new', (req, res, next) => {
    return res.send('Report form here')
})

// Add new report
router.post('/reports/new', (req, res, next) => {
     var newReport = {
        type: req.body.type,
        userId: req.body.user_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }

    reportHandler.addReport(newReport)
    .then((result) => {
        return res.json({msg: "Success"})
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Check your info and try again."})
    })
})

/* COMMENTS */

// Get all comments
router.get('/comments', (req, res, next) => {
    commentHandler.getComments()
    .then((results) => {
        return res.json(results)
    })
    .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
})

// Get comments by report id
router.get('/comments/report/:id', (req, res, next) => {
    commentHandler.getCommentsByReportId(req.params.id)
    .then((results) => {
        if(results.length == 0)
            return res.status(400).json({msg: "No comment found."})
        return res.json(results)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Sometçhing went wrong. Try again."})
    })

})

// Get comments by user id
router.get('/comments/user/:id', (req, res, next) => {
    commentHandler.getCommentsByUserId(req.params.id)
    .then((results) => {
        if(results.length == 0)
            return res.status(400).json({msg: "No comment found."})
        return res.json(results)
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Try again."})})
})

// Add new comment
router.post('/comments/new', (req, res, next) => {
    var newComment = {
        userId: req.body.user_id,
        reportId: req.body.report_id,
        text: req.body.text
    }

    commentHandler.addComment(newComment)
    .then( (result) => {
        return res.json({msg: "Success!"})
    })
    .catch((e) => {
        console.log(e)
        return res.status(400).json({msg: "Something went wrong. Check your info and try again."})})
})

module.exports = router;