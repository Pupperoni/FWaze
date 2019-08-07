var knex = require("../../knex");

const Handler = {
  getAds() {
    return knex
      .raw("CALL GetAllAds()")
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  createAd(adData) {
    return knex
      .raw("CALL CreateAd(?,?,?)", [
        adData.id,
        adData.longitude,
        adData.latitude
      ])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAdById(adId) {
    return knex
      .raw("CALL GetAdById(?)", [adId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAdsByBorder(xl, xu, yl, yu) {
    return knex
      .raw("CALL GetAdsByBorder(?,?,?,?)", [xl, xu, yl, yu])
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
