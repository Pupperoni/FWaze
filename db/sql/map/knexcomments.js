var knex = require('../../knex')

function addComment(commentData){
    return knex.raw('INSERT INTO comments (user_id, report_id, text) VALUES (?,?,?)', [commentData.userId, commentData.reportId, commentData.text])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getComments(){
    return knex.raw('SELECT id, user_id, report_id, text FROM comments')
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getCommentsByReportId(reportId){
    return knex.raw('SELECT id, user_id, text FROM comments WHERE report_id = ?', [reportId])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getCommentsByUserId(userId){
    return knex.raw('SELECT id, report_id, text FROM comments WHERE user_id = ?', [userId])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getText(id){
    return knex.raw('SELECT text FROM comments WHERE id = ?', [id])
    .then((row) => {
        return Promise.resolve(row[0][0])
    })
}

module.exports = {
    addComment: addComment,
    getComments: getComments,
    getCommentsByReportId: getCommentsByReportId,
    getCommentsByUserId: getCommentsByUserId,
    getText: getText
}