const queryHandler = require("../../db/sql/map/comments.repository");

const Handler = {
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
      .getCommentsByReportId(req.params.id)
      .then(results => {
        if (results.length == 0)
          return res.status(400).json({ msg: "No comment found." });
        return res.json({ data: results });
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

  // Add a comment
  createComment(req, res, next) {
    var newComment = {
      userId: req.body.user_id,
      reportId: req.body.report_id,
      text: req.body.text
    };

    queryHandler
      .createComment(newComment)
      .then(result3 => {
        return res.json({ msg: "Success!" });
      })
      .catch(e => {
        return res.status(500).json({ err: e });
      });
  }
};

module.exports = Handler;
