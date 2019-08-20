const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

module.exports = {
  getCurrentState(id) {
    // get history of events of user id (TO DO: Get from last snapshot)
    return Promise.resolve(
      redis.zrange(`event:USER:${id}`, 0, -1).then(history => {
        // user has no history yet
        if (history.length == 0) return null;

        // build the details of the user
        var user = {
          id: id,
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
          if (event.eventName === "USER CREATED") {
            user.name = payload.name;
            user.email = payload.email;
            user.password = payload.password;
            user.role = payload.role;
          } else if (event.eventName === "USER UPDATED") {
            user.name = payload.name;
            user.email = payload.email;
            user.password = payload.password;
            user.role = payload.role;
            user.avatarPath = payload.avatarPath;
          } else if (event.eventName === "USER HOME_UPDATED") {
            user.home.latitude = payload.latitude;
            user.home.longitude = payload.longitude;
            user.home.address = payload.address;
          } else if (event.eventName === "USER WORK_UPDATED") {
            user.work.latitude = payload.latitude;
            user.work.longitude = payload.longitude;
            user.work.address = payload.address;
          } else if (event.eventName === "USER ROUTE_CREATED") {
            user.faveRoutes.push(payload);
          }
        });

        // current state of user
        return user;
      })
    );
  }
};
