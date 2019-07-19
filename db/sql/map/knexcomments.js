var knex = require('../../knex')

function addComment(commentData){
    knex.raw('INSERT INTO comments (user_id, report_id, text) VALUES (?,?,?)', [commentData.userId, commentData.reportId, commentData.text])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getAllComments(){
    knex.raw('SELECT id, user_id, report_id, text FROM comments')
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getCommentsByReportId(reportId){
    knex.raw('SELECT id, user_id, text FROM comment WHERE report_id = ?', [reportId])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

function getCommentsByUserId(userId){
    knex.raw('SELECT id, report_id, text, FROM comment WHERE report_id = ?', [reportId])
    .then((row) => {
        return Promise.resolve(row[0])
    })
}

module.exports = {
    addComment: addComment,
    getAllComments: getAllComments,
    getCommentsByReportId: getCommentsByReportId,
    getCommentsByUserId: getCommentsByUserId
}