var express = require('express');
var router = express.Router();
var userHandler = require('../db/sql/knexusers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var userList = userHandler.getAllUsers()
  console.log(userList)
  res.send({msg: userList})
});

/* GET login form. */
router.get('/login', function(req, res, next) {
  res.send('Insert form here')
});

// Create new user account
router.post('/new', (req, res) => {
  var newMember = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
  }

  // if(!newMember.name || !newMember.email || newMember.role != undefined){
  //     return res.status(400).json({msg: "Please include name, email and role"})
  // }

  userHandler.addUser(newMember)
  res.json({name: newMember.name, email: newMember.email, role: newMember.role})
})

module.exports = router;
