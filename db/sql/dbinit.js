var knex = require('../knex')

// Creates a user table
knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.integer('role').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)




