const express = require('express')
const router = express.Router()
const mapHandler = require('../db/sql/knexmap')
const userHandler = require('../db/sql/knexusers')

// Display map
router.get('/', (req, res, next) => {
    res.send("Welcome to map | FWaze")
})

// Get all ads
router.get('/ads', (req, res, next) => {
    mapHandler.getAds()
    .then((results) => {
        return res.json(results)
    })
    .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
})

// Get ad by id
router.get('/ads/:id', (req, res, next) => {
    res.send(`Ad ${req.params.id} here`)
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

        mapHandler.addAd(newAd)
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
module.exports = router;