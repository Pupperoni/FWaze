var knex = require('../knex')

// Creates a advertisement table
knex.schema.createTable('advertisements', (table) => {
    table.increments('id').primary()
    table.string('caption').notNullable()
    table.integer('user_id').unsigned().references('users.id')
    table.float('latitude',10,6)
    table.float('longitude',10,6)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)




