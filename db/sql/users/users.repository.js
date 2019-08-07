var knex = require("../../knex");

const Handler = {
  // Fetch all user names and emails
  getAllUsers(id) {
    return knex
      .raw("SELECT id, name, email, role FROM users")
      .then(row => {
        // for some reason, the sql query is also sent as the 2nd element
        // so we return only the first
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Fetch a user's name and email
  getUserById(id) {
    return knex
      .raw("CALL GetUserById(?)", [id])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Insert new user to 'users'
  createUser(user) {
    // return knex('users').insert(user)
    return knex
      .raw("CALL CreateUser(?,?,?,?,?)", [
        user.id,
        user.name,
        user.email,
        user.password,
        user.role
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Update user details
  updateUser(user) {
    return knex
      .raw("CALL UpdateUser(?,?,?,?)", [
        user.name,
        user.email,
        user.role,
        user.id
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  },

  // Fetch role of a user by id
  getUserRole(id) {
    return knex
      .raw("SELECT role FROM users WHERE id = ?", [id])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Fetch name of a user by id
  getUserName(id) {
    return knex
      .raw("SELECT name FROM users WHERE id = ?", [id])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getUserByName(name) {
    return knex
      .raw("SELECT id, name, password, email, role FROM users WHERE name=?", [
        name
      ])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
