var knex = require('../../knex')

knex.schema.createTable('comments', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().references('users.id')
    table.integer('report_id').unsigned().references('reports.id')
    table.string('text')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)