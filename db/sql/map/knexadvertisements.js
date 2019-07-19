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

module.exports = {
    addAd: addAd,
    getAds: getAds,
    getAdById: getAdById,
    getAdByUserId: getAdByUserId

}