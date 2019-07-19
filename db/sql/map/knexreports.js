var knex = require('../../knex')

/* Report types:
    0 - Traffic jam
    1 - Heavy traffic jam
    2 - Police trap
    3 - Road closed
    4 - Car stopped on road
    5 - Construction
    6 - Minor accident
    7 - Major accident */

function addReport(reportData){
    return knex.raw('INSERT INTO reports (type, user_id, latitude, longitude) VALUES (?,?,?,?)', [reportData.type, reportData.userId, reportData.latitude, reportData.longitude])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getAllReports(){
    return knex.raw('SELECT id, type, votes, latitude, longitude FROM reports')
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getReportsByType(type){
    return knex.raw('SELECT id, votes, latitude, longitude FROM reports WHERE reports.type = ?', [type])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getReporterId(reportId){
    return knex.raw('SELECT users.id FROM reports INNER JOIN users ON reports.user_id = users.id WHERE reports.id = ?', [reportId])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

function getReportById(id){
    return knex.raw('SELECT type, votes, latitude, longitude FROM reports WHERE id = ?',[id])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

function getReportsByBorder(xl, xu, yl, yu){

    return knex.raw('SELECT newpoints.type, users.id as user_id, newpoints.latitude, newpoints.longitude FROM (SELECT * FROM reports WHERE latitude > ? and latitude < ? and longitude > ? and longitude < ?) as newpoints INNER JOIN users on newpoints.user_id = users.id', [xl, xu, yl, yu])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

module.exports = {
    addReport: addReport,
    getAllReports: getAllReports,
    getReporterId: getReporterId,
    getReportsByType: getReportsByType,
    getReportById: getReportById,
    getReportsByBorder: getReportsByBorder

}