let express = require("express");
let router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sample", (req, res, next) => {
  res.json({ msg: "Congrats" });
});

module.exports = router;
