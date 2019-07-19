var express = require('express');
var router = express.Router();
var userHandler = require('../db/sql/knexusers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  userHandler.getAllUsers()
  .then((results) => {
    return res.json(results)
  })
  .catch((e) => {
    return res.status(400).json({msg: "Something went wrong. Check the error and try again", err:e})
  })
});

// Get single user
router.get('/:id', (req, res, next) => {
  userHandler.getUserById(req.params.id)
  .then((results) => {
    if(results.length == 0)
      return res.status(400).json({msg: "Something went wrong. Check the error and try again"})
    return res.json(results[0])  // result sent as a list so we take the first (and only) element
  })
  .catch((e) => {
    return res.status(400).json({msg: "Something went wrong. Check the error and try again", err:e,err:e})
  })
})

// User creation form
router.get('/new', (req, res) => {
  res.send("New user form here")
})

// Create new user account
router.post('/new', (req, res) => {
  var newMember = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
  }

  userHandler.addUser(newMember)
  .then( (result) => {return res.json(result)})
  .catch( () => {return res.status(400).json({msg: "Something went wrong. Check your info and try again."})})
})

/* GET login form. */
router.get('/login', function(req, res, next) {
  res.send('Insert form here')
});

module.exports = router;
