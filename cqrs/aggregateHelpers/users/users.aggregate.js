const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

module.exports = {
  getCurrentState(identifier) {
    // get history of events of user id (TO DO: Get from last snapshot)

    return Promise.resolve(
      redis
        .zrange(`events:${constants.USER_AGGREGATE_NAME}:${identifier}`, 0, -1)
        .then(history => {
          // user has no history yet
          if (history.length === 0) return null;
          let user = {};

          // Recount history
          history.forEach(event => {
            event = JSON.parse(event);
            let payload = event.payload;

            if (event.eventName === constants.USER_CREATED) {
              user.id = payload.id;
              user.name = payload.name;
              user.email = payload.email;
              user.password = payload.password;
              user.role = payload.role;
            } else if (event.eventName === constants.USER_UPDATED) {
              user.name = payload.name;
              user.email = payload.email;
              user.role = payload.role;
              if (payload.avatarPath) user.avatarPath = payload.avatarPath;
            } else if (event.eventName === constants.USER_HOME_UPDATED) {
              if (!user.home) {
                user.home = {
                  latitude: undefined,
                  longitude: undefined,
                  address: undefined
                };
              }
              user.home.latitude = payload.latitude;
              user.home.longitude = payload.longitude;
              user.home.address = payload.address;
            } else if (event.eventName === constants.USER_WORK_UPDATED) {
              if (!user.work) {
                user.work = {
                  latitude: undefined,
                  longitude: undefined,
                  address: undefined
                };
              }
              user.work.latitude = payload.latitude;
              user.work.longitude = payload.longitude;
              user.work.address = payload.address;
            } else if (event.eventName === constants.USER_ROUTE_CREATED) {
              if (!user.faveRoutes) {
                user.faveRoutes = [];
              }
              user.faveRoutes.push(payload);
            }
          });

          // user does not exist if it was not created
          if (!user.id) return null;

          // current state of user
          return user;
        })
    );
  }
};
