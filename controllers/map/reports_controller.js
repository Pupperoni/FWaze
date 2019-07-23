const queryHandler = require('../../db/sql/map/reports.repository')
const userHandler = require('../../db/sql/users/users.repository')

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

const Handler = {

    // Get all reports
    getAllReports(req, res, next) {
        queryHandler.getAllReports()
        .then((results) => {
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Please try again."})
        })
    },

    // Get report by report id
    getReportById(req, res, next) {
        queryHandler.getReportById(req.params.id)
        .then((result) => {
            if(!result) return res.status(400).json({msg: "This report does not exist!"})
            return res.json(result)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Please try again."})
        })
    },

    // Get reports by user id (list down all reports made by a user)
    getReportsByUserId(req, res, next) {
        queryHandler.getReportsByUserId(req.params.id)
        .then((results) => {
            if(results.length == 0) return res.status(400).json({msg: `User ${req.params.id} had no ads!`})
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    // Get all reports of a specific type
    getReportsByType(req, res, next) {
        queryHandler.getReportsByType(reportTypes[req.params.type])
        .then((results) => {
            if(results.length == 0)
                return res.status(400).json({msg: "No reports of this type."})
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Please try again."})
        })
    },

    // Get all reports enclosed in an area
    getReportsByRange(req, res, next) {
        var left = parseInt(req.query.tleft.split(",")[0])
        var right = parseInt(req.query.bright.split(",")[0])
        var top = parseInt(req.query.tleft.split(",")[1])
        var bottom = parseInt(req.query.bright.split(",")[1])
        queryHandler.getReportsByBorder(left,right,bottom,top)
        .then((results) => {
            if(results.length == 0) return res.status(400).json({msg: "No reports found."})
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Please try again."})
        })
    },

    // Get all reports enclosed in an area of a specific type
    getReportsByTypeRange(req, res, next) {
        var left = parseInt(req.query.tleft.split(",")[0])
        var right = parseInt(req.query.bright.split(",")[0])
        var top = parseInt(req.query.tleft.split(",")[1])
        var bottom = parseInt(req.query.bright.split(",")[1])
        queryHandler.getReportsByTypeBorder(reportTypes[req.params.type],left,right,bottom,top)
        .then((results) => {
            if(results.length == 0) return res.status(400).json({msg: "No reports found."})
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Please try again."})
        })
    },


    // Add a new report
    addReport(req, res, next) {

        userHandler.getUserById(req.body.user_id)
        .then((result) => {
            if(!result) return res.status(400).json({msg: `User does not exist!`})
            else {
                var newReport = {
                    type: req.body.type,
                    userId: req.body.user_id,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                }

                if(newReport.type < 0 || newReport.type > 7) return res.status(400).json({msg: `Invalid type.`})
               
               queryHandler.addReport(newReport)
               .then((result) => {
                   return res.json({msg: "Success"})
               })
               .catch((e) => {
                   console.log(e)
                   return res.status(400).json({msg: "Something went wrong. Check your info and try again."})
               })
            }
        })        
   }
}

module.exports = Handler