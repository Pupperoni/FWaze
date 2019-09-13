const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

module.exports = {
  cursor: 0,

  findAdQueryKey(id) {
    console.log("[UTILITIES] Current cursor:", this.cursor);
    return Promise.resolve(
      redis.scan(this.cursor, "match", `ad:*:${id}`).then(results => {
        // update the cursor
        this.cursor = results[0];
        // the key has been found!
        if (results[1].length > 0) {
          console.log("[UTILITIES] Key found", results[1]);
          return results[1];
        }
        // entire scan completed but key not found
        // else if (this.adQueryCursor === 0) {
        //   console.log("[UTILITIES] Key not found");
        //   return null;
        // }
        else {
          return this.findAdQueryKey(id);
        }
      })
    );
  },

  findReportQueryKey(id) {
    console.log("[UTILITIES] Current cursor:", this.cursor);
    return Promise.resolve(
      redis.scan(this.cursor, "match", `report:*:${id}`).then(results => {
        // update the cursor
        this.cursor = results[0];
        // the key has been found!
        if (results[1].length > 0) {
          console.log("[UTILITIES] Key found", results[1]);
          return results[1];
        }
        // entire scan completed but key not found
        // else if (this.cursor === 0) {
        //   console.log("[UTILITIES] Key not found");
        //   return null;
        // }
        else {
          // look for the key again
          return this.findReportQueryKey(id);
        }
      })
    );
  },

  findReportUserKey(id) {
    console.log("[UTILITIES] Current cursor:", this.cursor);
    return Promise.resolve(
      redis.scan(this.cursor, "match", `report:${id}:*`).then(results => {
        // update the cursor
        this.cursor = results[0];
        // the key has been found!
        if (results[1].length > 0) {
          console.log("[UTILITIES] Key found", results[1]);
          return results[1];
        } // entire scan completed but key not found
        // else if (this.cursor === 0) {
        //   console.log("[UTILITIES] Key not found");
        //   return null;
        // }
        else {
          // look for the key again
          return this.findReportUserKey(id);
        }
      })
    );
  },

  findAdUserKey(id) {
    console.log("[UTILITIES] Current cursor:", this.cursor);
    return Promise.resolve(
      redis.scan(this.cursor, "match", `report:${id}:*`).then(results => {
        // update the cursor
        this.cursor = results[0];
        // the key has been found!
        if (results[1].length > 0) {
          console.log("[UTILITIES] Key found", results[1]);
          return results[1];
        } // entire scan completed but key not found
        // else if (this.cursor === 0) {
        //   console.log("[UTILITIES] Key not found");
        //   return null;
        // }
        else {
          // look for the key again
          return this.findAdUserKey(id);
        }
      })
    );
  }
};
