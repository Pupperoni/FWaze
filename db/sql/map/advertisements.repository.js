var knex = require("../../knex");

const Handler = {
  getAds() {
    return knex
      .raw("SELECT * FROM advertisements")
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  createAd(adData) {
    return knex
      .raw(
        "INSERT INTO advertisements (id, position) VALUES (?,ST_PointFromText('POINT(? ?)'))",
        [adData.id, adData.longitude, adData.latitude]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAdById(adId) {
    return knex
      .raw("SELECT * FROM advertisements WHERE id = ?", [adId])
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAdsByBorder(xl, xu, yl, yu) {
    return knex
      .raw(
        "SELECT * FROM advertisements WHERE ST_Contains(ST_GeomFromText('POLYGON((? ?, ? ?, ? ?, ? ?, ? ?))'), position)",
        [xl, yl, xu, yl, xu, yu, xl, yu, xl, yl]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = Handler;
