const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const constants = require("../../../constants");

module.exports = {
  getCurrentState(id) {
    // get history of events of user id

    let user = {};
    let lastOffset = 0;
    return Promise.resolve(
      // check if snapshot exists
      redis
        .hgetall(`snapshot:${constants.USER_AGGREGATE_NAME}:${id}`)
        .then(snapshot => {
          // snapshot exists - start here
          if (snapshot.offset && snapshot.currentState) {
            user = JSON.parse(snapshot.currentState);
            lastOffset = parseInt(snapshot.offset) + 1;
          }
          return redis.zrange(
            `events:${constants.USER_AGGREGATE_NAME}:${id}`,
            lastOffset,
            -1
          );
        })
        .then(history => {
          // Recount history
          console.log(`Start at offset: ${lastOffset}`);
          console.log("User:");
          console.log(user);
          console.log("History:");
          console.log(history);
          history.forEach(event => {
            event = JSON.parse(event);
            let payload = event.payload;

            switch (event.eventName) {
              case constants.USER_CREATED:
                user.id = payload.id;
                user.name = payload.name;
                user.email = payload.email;
                user.password = payload.password;
                user.role = payload.role;
                break;
              case constants.USER_UPDATED:
                user.name = payload.name;
                user.email = payload.email;
                user.role = payload.role;
                if (payload.avatarPath) user.avatarPath = payload.avatarPath;
                break;
              case constants.USER_HOME_UPDATED:
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
              case constants.USER_WORK_UPDATED:
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
              case constants.USER_ROUTE_CREATED:
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
