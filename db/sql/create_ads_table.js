var knex = require('../knex')

// Creates a advertisement table
knex.schema.createTable('advertisements', (table) => {
    table.increments('id').primary()
    table.string('caption').notNullable()
    table.integer('user_id').unsigned().references('users.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)

knex.raw('ALTER TABLE advertisements ADD position POINT')
.then(console.log)
.catch(console.log)




