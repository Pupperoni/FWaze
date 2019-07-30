var knex = require("../../knex");

const Handler = {
  getAds() {
    return knex
      .raw(
        "SELECT advertisements.id, caption, position, user_id, users.name FROM advertisements INNER JOIN users ON advertisements.user_id = users.id"
      )
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
        "INSERT INTO advertisements (caption, user_id, position) VALUES (?,?,ST_PointFromText('POINT(? ?)'))",
        [adData.caption, adData.userId, adData.longitude, adData.latitude]
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
      .raw(
        "SELECT advertisements.id, caption, position, user_id, users.name FROM advertisements INNER JOIN users on users.id = advertisements.user_id WHERE advertisements.id = ?",
        [adId]
      )
      .then(row => {
        return Promise.resolve(row[0][0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAdByUserId(userId) {
    return knex
      .raw(
        "SELECT advertisements.id, advertisements.caption, advertisements.position, user_id, users.name FROM advertisements INNER JOIN users ON advertisements.user_id = users.id WHERE users.id = ?",
        [userId]
      )
      .then(row => {
        return Promise.resolve(row[0]);
      })
      .catch(e => {
        throw e;
      });
  },

  getAdsByBorder(xl, xu, yl, yu) {
    return knex
      .raw(
        "SELECT newpoints.id, newpoints.caption, newpoints.user_id, users.name, newpoints.position FROM (SELECT * FROM advertisements WHERE ST_Contains(ST_GeomFromText('POLYGON((? ?, ? ?, ? ?, ? ?, ? ?))'), position)) as newpoints INNER JOIN users on newpoints.user_id = users.id",
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
