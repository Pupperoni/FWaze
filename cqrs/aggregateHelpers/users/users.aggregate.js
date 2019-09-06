const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const CONSTANTS = require("../../../constants");

module.exports = {
  getCurrentState(id) {
    // get history of events of user id

    let user = {};
    let lastOffset = 0;
    return Promise.resolve(
      // check if snapshot exists
      redis
        .hgetall(`snapshot:${CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME}:${id}`)
        .then(snapshot => {
          // snapshot exists - start here
          if (snapshot.offset && snapshot.currentState) {
            user = JSON.parse(snapshot.currentState);
            lastOffset = parseInt(snapshot.offset) + 1;
          }
          return redis.zrange(
            `events:${CONSTANTS.AGGREGATES.USER_AGGREGATE_NAME}:${id}`,
            lastOffset,
            -1
          );
        })
        .then(history => {
          // Recount history
          // console.log(`Start at offset: ${lastOffset}`);
          // console.log("User:");
          // console.log(user);
          // console.log("History:");
          // console.log(history);
          history.forEach(event => {
            event = JSON.parse(event);
            let payload = event.payload;

            switch (event.eventName) {
              case CONSTANTS.EVENTS.CREATE_USER:
                user.id = payload.id;
                user.name = payload.name;
                user.email = payload.email;
                user.password = payload.password;
                if (payload.role) user.role = payload.role;
                else user.role = 0;
                break;
              case CONSTANTS.EVENTS.UPDATE_USER:
                if (payload.name) user.name = payload.name;
                if (payload.email) user.email = payload.email;
                if (payload.role) user.role = payload.role;
                if (payload.avatarPath) user.avatarPath = payload.avatarPath;
                break;
              case CONSTANTS.EVENTS.UPDATE_USER_HOME:
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
                break;
              case CONSTANTS.EVENTS.UPDATE_USER_WORK:
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
                break;
              case CONSTANTS.EVENTS.CREATE_USER_ROUTE:
                if (!user.faveRoutes) {
                  user.faveRoutes = [];
                }
                user.faveRoutes.push(payload.routeId);
                break;
              case CONSTANTS.EVENTS.DELETE_USER_ROUTE:
                let index = user.faveRoutes.indexOf(payload.routeId);
                user.faveRoutes.splice(index, 1);
                break;
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
