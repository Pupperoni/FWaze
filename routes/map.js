const express = require('express')
const router = express.Router()
const adHandler = require('../db/sql/map/knexadvertisements')
const reportHandler = require('../db/sql/map/knexreports')
const userHandler = require('../db/sql/users/knexusers')

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

// Get all reports
router.get('/reports', (req, res, next) => {
    return res.send("Report list here")
})

// Get report by report id
router.get('/reports/:id', (req, res, next) => {
    return res.send(`Report ${req.params.id} here`)
})

//
router.get('/reports/new', (req, res, next) => {
    return res.send('Report form here')
})

// Add new report
router.post('/reports/new', (req, res, next) => {
    // return res.send('Add new report')
     var newReport = {
        type: req.body.type,
        userId: req.body.user_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
})

module.exports = router;