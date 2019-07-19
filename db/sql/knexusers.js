var knex = require('../knex')

// Insert new user to 'users'
function addUser(user){
    // return knex('users').insert(user)
    return knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [user.name, user.email, user.role])
}

function getAllUsers(){
    return knex.raw('SELECT name, email FROM users')
}

function getUserById(id){
    return knex.raw('SELECT name, email FROM users WHERE id = ?', [id])
}

module.exports = {
    addUser: addUser,
    getAllUsers: getAllUsers,
    getUserById: getUserById
}