var knex = require('../../knex')

function addAd(adData){
    return knex.raw('INSERT INTO advertisements (caption, user_id, latitude, longitude) VALUES (?,?,?,?)', [adData.caption, adData.userId, adData.latitude, adData.longitude])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getAds(){
    return knex.raw('SELECT id, caption, latitude, longitude FROM advertisementd')
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getAdById(adISd){
    return knex.raw('SELECT id, caption, latitude, longitude WHERE id = ?', [adId])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

function getAdByUserId(userId){
    return knex.raw('SELECT advertisements.id, advertisements.caption, advertisements.latitude, advertisements.longitude FROM advertisements INNER JOIN users ON advertisements.user_id = users.id WHERE users.id = ?', [id])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

function getAdsByBorder(xl, xu, yl, yu){
    return knex.raw('SELECT newpoints.id, newpoints.type, users.id as user_id, newpoints.latitude, newpoints.longitude FROM (SELECT * FROM advertisements WHERE latitude > ? and latitude < ? and longitude > ? and longitude < ?) as newpoints INNER JOIN users on newpoints.user_id = users.id', [xl, xu, yl, yu])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

module.exports = {
    addAd: addAd,
    getAds: getAds,
    getAdById: getAdById,
    getAdByUserId: getAdByUserId,
    getAdsByBorder: getAdsByBorder

}