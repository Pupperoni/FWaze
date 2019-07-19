var knex = require('../../knex')

function addAd(adData){
    return knex.raw('INSERT INTO advertisements (caption, user_id, latitude, longitude) VALUES (?,?,?,?)', [adData.caption, adData.userId, adData.latitude, adData.longitude])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getAds(){
    return knex.raw('SELECT advertisements.caption, advertisements.latitude, advertisements.longitude, users.name FROM advertisements inner join users on users.id = advertisements.user_id')
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getAdById(id){
    return knex.raw('SELECT advertisements.caption, advertisements.latitude, advertisements.longitude, users.name FROM advertisements inner join users on users.id = advertisements.user_id WHERE advertisements.id = ?', [id])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

module.exports = {
    addAd: addAd,
    getAds: getAds,
    getAdById: getAdById,

}