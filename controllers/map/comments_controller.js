const queryHandler = require('../../db/sql/map/comments.repository')
const userHandler = require('../../db/sql/users/users.repository')
const reportHandler = require('../../db/sql/map/reports.repository')

const Handler = {

    getAllComments(req, res, next) {
        queryHandler.getComments()
        .then((results) => {
            return res.json(results)
        })
        .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    getCommentById(req, res, next) {
        queryHandler.getCommentById(req.params.id)
        .then((result) => {
            if(!result) return res.status(400).json({msg: "This comment does not exist!"})
            return res.json(result)
        })
        .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    getCommentByReportId(req, res, next) {
        queryHandler.getCommentsByReportId(req.params.id)
        .then((results) => {
            if(results.length == 0)
                return res.status(400).json({msg: "No comment found."})
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Sometçhing went wrong. Try again."})
        })
    },

    getCommentByUserId(req, res, next) {
        queryHandler.getCommentsByUserId(req.params.id)
        .then((results) => {
            if(results.length == 0)
                return res.status(400).json({msg: "No comment found."})
            return res.json(results)
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    addComment(req, res, next) {
        var newComment = {
            userId: req.body.user_id,
            reportId: req.body.report_id,
            text: req.body.text
        }
    
        queryHandler.addComment(newComment)
        .then( (result3) => {
            return res.json({msg: "Success!"})
        })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Check your info and try again."})
        })
    }
}

module.exports = Handler