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

          // build the details of the user
          var user = {
            id: identifier,
            name: undefined,
            email: undefined,
            password: undefined,
            role: undefined,
            home: {
              latitude: undefined,
              longitude: undefined,
              address: undefined
            },
            work: {
              latitude: undefined,
              longitude: undefined,
              address: undefined
            },
            faveRoutes: [],
            avatarPath: undefined
          };

          // Recount history
          history.forEach(event => {
            var event = JSON.parse(event);
            var payload = event.payload;

            if (event.eventName === constants.USER_CREATED) {
              user.id = payload.id;
              user.name = payload.name;
              user.email = payload.email;
              user.password = payload.password;
              user.role = payload.role;
            } else if (event.eventName === constants.USER_UPDATED) {
              user.name = payload.name;
              user.email = payload.email;
              user.password = payload.password;
              user.role = payload.role;
              user.avatarPath = payload.avatarPath;
            } else if (event.eventName === constants.USER_HOME_UPDATED) {
              user.home.latitude = payload.latitude;
              user.home.longitude = payload.longitude;
              user.home.address = payload.address;
            } else if (event.eventName === constants.USER_WORK_UPDATED) {
              user.work.latitude = payload.latitude;
              user.work.longitude = payload.longitude;
              user.work.address = payload.address;
            } else if (event.eventName === constants.USER_ROUTE_CREATED) {
              user.faveRoutes.push(payload);
            }
          });

          // user was not found in history
          if (user.name === undefined) return null;

          // current state of user
          return user;
        })
    );
  }
};
