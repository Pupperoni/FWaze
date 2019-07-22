var knex = require('../../knex')

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
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)

knex.raw('ALTER TABLE reports ADD position POINT')
.then(console.log)
.catch(console.log)



