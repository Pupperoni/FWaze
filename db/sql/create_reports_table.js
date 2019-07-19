var knex = require('../knex')

/* Report types:
    0 - Traffic jam
    1 - Heavy traffic jam
    2 - Road closed
    3 - Minor accident
    4 - Major accident
    5 - Police trap
    6 - Construction
    7 - Hazard
*/

// Creates a advertisement table
knex.schema.createTable('reports', (table) => {
    table.increments('id').primary()
    table.integer('type').notNullable()
    table.integer('votes').defaultTo(0).comment("This is the number of upvotes")
    table.integer('user_id').unsigned().references('users.id')
    table.float('latitude',10,6)
    table.float('longitude',10,6)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)




