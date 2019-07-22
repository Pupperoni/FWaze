var express = require('express');
var router = express.Router();
var userHandler = require('../controllers/users/users_controller')

// User creation form
router.get('/new', (req, res, next) => {res.send("New user form here")})

// Create new user account
router.post('/new', (req, res, next) => {userHandler.addUser(req, res, next)});

/* GET login form. */
router.get('/login', function(req, res, next) {
  res.send('Insert form here')
});

// Get single user
router.get('/:id', (req, res, next) => {userHandler.getUserById(req, res, next)});

/* GET users listing. */
router.get('/', (req, res, next) => {userHandler.getAllUsers(req, res, next)});

module.exports = router;
