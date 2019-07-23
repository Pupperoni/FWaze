const queryHandler = require('../../db/sql/map/comments.repository')

const Handler = {

    // Get all comments
    getAllComments(req, res, next) {
        queryHandler.getComments()
        .then((results) => {
            return res.json(results)
        })
        .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    // Get comment by comment id
    getCommentById(req, res, next) {
        queryHandler.getCommentById(req.params.id)
        .then((result) => {
            if(!result) return res.status(400).json({msg: "This comment does not exist!"})
            return res.json(result)
        })
        .catch((e) => {return res.status(400).json({msg: "Something went wrong. Try again."})})
    },

    // Get comments by report id (list down all comments on a report)
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

    // Get comments by user id (list down all comments made by a user)
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

    // Add a comment
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