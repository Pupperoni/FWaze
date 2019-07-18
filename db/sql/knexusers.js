var knex = require('../knex')

// Insert new user to 'users'
function addUser(user){
    // return knex('users').insert(user)
    return knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [user.name, user.email, user.role])
}

function getAllUsers(){
    return knex.select('*').from('users')
    .map(function(row) {console.log(row);})
    // return knex.raw('SELECT * FROM users');
}

module.exports = {
    addUser: addUser,
    getAllUsers: getAllUsers
}