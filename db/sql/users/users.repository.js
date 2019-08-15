var knex = require("../../knex");

const Handler = {
  // Fetch all user names and emails
  getAllUsers(id) {
    return knex
      .raw("CALL GetAllUsers()")
      .then(row => {
        // for some reason, the sql query is also sent as the 2nd element
        // so we return only the first
        return Promise.resolve(row[0][0]);
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

  // Set a home address for a user
  setHomeAd(id, addr) {
    return knex
      .raw("CALL SetHomeAd(?,?)", [id, addr])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Set a work address for a user
  setWorkAd(id, addr) {
    return knex
      .raw("CALL SetWorkAd(?,?)", [id, addr])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Add a route to favorites
  createFaveRoute(routeData) {
    return knex
      .raw("CALL CreateFaveRoute(?,?,?,?,?,?,?,?)", [
        routeData.id,
        routeData.sourceLatitude,
        routeData.sourceLongitude,
        routeData.destinationLatitude,
        routeData.destinationLongitude,
        routeData.sourceString,
        routeData.destinationString,
        routeData.userId
      ])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  // Get all faved routes
  getFaveRoutes(userId) {
    return knex
      .raw("CALL GetRoutesByUserId(?)", [userId])
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
        throw e;
      });
  }
};

module.exports = Handler;
