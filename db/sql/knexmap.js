var knex = require('../knex')

/* Report types:
    0 - Traffic jam
    1 - Heavy traffic jam
    2 - Police trap
    3 - Road closed
    4 - Car stopped on road
    5 - Construction
    6 - Minor accident
    7 - Major accident */

function addReport(type, userId){

}

function addAd(adData){
    return knex.raw('INSERT INTO advertisements (caption, user_id) VALUES (?,?)', [adData.caption, adData.userId])
}

function getAds(){
    return knex.raw('SELECT advertisements.id, users.name FROM advertisements inner join users on users.id = advertisements.user_id')
}

function getAdById(id){
    // return knex.raw('SELECT caption')
}

module.exports = {
    addAd: addAd,
    getAds: getAds,

}