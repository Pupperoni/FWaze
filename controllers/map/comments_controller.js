const queryHandler = require("../../db/sql/map/comments.repository");
const commandHandler = require("../../cqrs/commands/map/comments.command.handler");

const Handler = {
  //
  //  Query responsibility
  //

  // Get all comments
  getAllComments(req, res, next) {
    queryHandler
      .getComments()
      .then(results => {
        return res.json({ data: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get comment by comment id
  getCommentById(req, res, next) {
    queryHandler
      .getCommentById(req.params.id)
      .then(result => {
        if (!result)
          return res.status(400).json({ msg: "This comment does not exist!" });
        return res.json({ data: result });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get comments by report id (list down all comments on a report)
  getCommentsByReportId(req, res, next) {
    queryHandler
      .getCommentsByReportId(req.params.id, req.query.page)
      .then(results => {
        if (results.length == 0)
          return res.json({ msg: "No comment found.", data: [] });
        return res.json({ data: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get comments by report id (list down all comments on a report)
  getCommentsByReportIdExplain(req, res, next) {
    queryHandler
      .getCommentsByReportIdExplain(req.params.id, req.query.page)
      .then(results => {
        if (results.length == 0)
          return res.json({ msg: "No comment found.", data: [] });
        return res.json({ data: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get comments by report id (list down all comments on a report)
  countCommentsByReportId(req, res, next) {
    queryHandler
      .countCommentsByReportId(req.params.id)
      .then(results => {
        return res.json({ data: results["COUNT(*)"] });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  // Get comments by user id (list down all comments made by a user)
  getCommentsByUserId(req, res, next) {
    queryHandler
      .getCommentsByUserId(req.params.id)
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No comment found." });
        return res.json({ data: results });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  },

  //
  //  Commands responsibility section
  //

  // Add a comment
  createComment(req, res, next) {
    commandHandler
      .commentCreated(req.body)
      .then(result => {
        if (result) return res.json({ msg: "Success", data: result });
        else return res.status(400).json({ msg: "Failed" });
      })
      .catch(e => {
        return res.status(400).json({ msg: "Failed", err: e });
      });
  }
};

module.exports = Handler;
