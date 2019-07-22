const queryHandler = require('../../db/sql/map/advertisements.repository')
const userHandler = require('../../db/sql/users/users.repository')

const Handler = {

    getAllAds(req, res, next) {
        queryHandler.getAds()
        .then((results) => {
            return res.json(results)
        })
        .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    getAdById(req, res, next) {
        queryHandler.getAdById(req.params.id)
        .then((result) => {
            if(!result) return res.status(400).json({msg: "This ad does not exist!"})
            return res.json(result)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    getAdByUserId(req, res, next) {
        queryHandler.getAdByUserId(req.params.id)
        .then((result) => {
            if(result == undefined)
                return res.status(400).json({msg: `User ${req.params.id} had no ads!`})
            return res.json(result)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    getAdsByRange(req, res, next) {
        var left = parseInt(req.query.tleft.split(",")[0])
        var right = parseInt(req.query.bright.split(",")[0])
        var top = parseInt(req.query.tleft.split(",")[1])
        var bottom = parseInt(req.query.bright.split(",")[1])
        queryHandler.getAdsByBorder(left,right,bottom,top)
        .then((results) => {
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Please try again."})
        })
    },

    addAd(req, res, next) {
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
    
            queryHandler.addAd(newAd)
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
    }
}

module.exports = Handler