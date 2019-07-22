var knex = require('../../knex')

const Handler = {

    // Fetch all user names and emails
    getAllUsers(id) {
        return knex.raw('SELECT id, name, email, role FROM users')
        .then((row) => {
            // for some reason, the sql query is also sent as the 2nd element
            // so we return only the first
            return Promise.resolve(row[0])
        })
    },

    // Fetch a user's name and email
    getUserById(id){
        return knex.raw('SELECT id, name, email, role FROM users WHERE id = ?', [id])
        .then((row) => {
            return Promise.resolve(row[0][0])
        })
    },

    // Insert new user to 'users'
    addUser(user){
        // return knex('users').insert(user)
        return knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [user.name, user.email, user.role])
        .then((row) => {
            return Promise.resolve(row[0])
        })
    },

    // Fetch role of a user by id
    getUserRole(id){
        return knex.raw('SELECT role FROM users WHERE id = ?', [id])
        .then((row) => {
            return Promise.resolve(row[0][0])
        })
    },

    // Fetch name of a user by id
    getUserName(id){
        return knex.raw('SELECT name FROM users WHERE id = ?', [id])
        .then((row) => {
            return Promise.resolve(row[0][0])
        })
    },

}

module.exports = Handler