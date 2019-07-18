var knex = require('../knex')

// Creates a user table
knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.integer('role').notNullable()
    table.timestamps();
})
.then(console.log)
.catch(console.log)




