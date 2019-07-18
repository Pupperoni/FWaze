var knex = require('../knex')

function addUser(user){
    return knex.raw('INSERT INTO users (name, email, role) VALUES ("' + user.name + '", "' + user.email + '", ' + user.role.toString() + ')')
}

function getAllUsers(){
    return knex('users').select("*")
}

module.exports = {
    addUser: addUser,
    getAllUsers: getAllUsers
}