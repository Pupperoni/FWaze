const queryHandler = require('../../db/sql/users/users.repository')

const Handler = {

    // Get all user info
    getAllUsers(req, res, next) {
        queryHandler.getAllUsers()
        .then((results) => { return res.json(results) })
        .catch((e) => {
            console.log(e)
            return res.status(400).json({msg: "Something went wrong. Check the error and try again"})
        })
    },

    // Get user by user id
    getUserById(req, res, next) {
        queryHandler.getUserById(req.params.id)
        .then((results) => {
            if(!results) return res.status(400).json({msg: "This user does not exist!"})
            return res.json(results)
        })
        .catch((e) => {
            return res.status(400).json({msg: "Something went wrong. Check the error and try again"})
        })
    },

    // Add a new user
    addUser(req, res, next) {
        var newMember = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
      
        queryHandler.addUser(newMember)
        .then( (result) => { return res.json({msg: "Success"})} )
        .catch( () => { return res.status(400).json({msg: "Something went wrong. Check your info and try again."})} )
    }
}

module.exports = Handler