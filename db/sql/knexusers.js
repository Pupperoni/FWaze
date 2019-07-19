var knex = require('../knex')

// Fetch all user names and emails
function getAllUsers(){
    return knex.raw('SELECT name, email FROM users')
    .then((row) => {
        // for some reason, the sql query is also sent as the 2nd element
        // so we return only the first
        return Promise.resolve(row[0])
    })
}

// Fetch a user's name and email
function getUserById(id){
    return knex.raw('SELECT name, email FROM users WHERE id = ?', [id])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

// Insert new user to 'users'
function addUser(user){
    // return knex('users').insert(user)
    return knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [user.name, user.email, user.role])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

// Fetch role of a user by id
function getUserRole(id){
    return knex.raw('SELECT role FROM users WHERE id = ?', [id])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

module.exports = {
    addUser: addUser,
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    getUserRole: getUserRole
}