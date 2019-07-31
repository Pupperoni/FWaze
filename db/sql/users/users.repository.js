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
      .raw("SELECT id, name, email, role FROM users WHERE id = ?", [id])
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
      .raw("INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)", [
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
      .raw(
        "UPDATE users SET name = ?, email = ?, password = ?, role = ?, avatar = ? WHERE users.id = ?",
        user.name,
        user.email,
        user.password,
        user.role,
        user.avatar,
        user.id
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
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
