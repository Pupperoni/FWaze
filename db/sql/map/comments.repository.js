var knex = require('../../knex')

const Handler = {

    addComment(commentData){
        return knex.raw('INSERT INTO comments (user_id, report_id, text) VALUES (?,?,?)', [commentData.userId, commentData.reportId, commentData.text])
        .then((row) => {
            return Promise.resolve(row[0])
        })
    },
    
    getComments(){
        return knex.raw('SELECT id, user_id, report_id, text FROM comments')
        .then((row) => {
            return Promise.resolve(row[0])
        })
    },

    getCommentById(commentId){
        return knex.raw('SELECT id, user_id, report_id, text FROM comments WHERE id = ?', [commentId])
        .then((row) => {
            return Promise.resolve(row[0][0])
        })
    },
    
    getCommentsByReportId(reportId){
        return knex.raw('SELECT id, user_id, report_id, text FROM comments WHERE report_id = ?', [reportId])
        .then((row) => {
            return Promise.resolve(row[0])
        })
    },
    
    getCommentsByUserId(userId){
        return knex.raw('SELECT id, user_id, report_id, text FROM comments WHERE user_id = ?', [userId])
        .then((row) => {
            return Promise.resolve(row[0])
        })
    },
    
    getText(id){
        return knex.raw('SELECT text FROM comments WHERE id = ?', [id])
        .then((row) => {
            return Promise.resolve(row[0][0])
        })
    }
}


module.exports = Handler