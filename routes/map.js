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
    res.send("List of ads here")
})

// Get ad by id
router.get('/ads/:id', (req, res, next) => {
    res.send('Ad ${req.params.id} here')
})

// Add new advertisement
router.post('/ads/new', (req, res, next) => {
    // Check user role (must be advertiser)
    userHandler.getUserRole(req.body.user_id)
    .map((row) => {
        var role = row[0].role
        if(role != 1)
            return res.json({msg: "Sorry. Only advertisers can post advertisements."})
        
            // Creating ad here
            var newAd = {
                caption: req.body.caption,
                userId: req.body.user_id
            }

            mapHandler.addAd(newAd)
            .then( () => {res.json({msg: "Success!"})})
            .catch((e) => {res.send(JSON.parse(e))})
    })
    .catch(() => {})
})


module.exports = router;