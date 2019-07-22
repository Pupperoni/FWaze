var knex = require('../knex')

knex.schema.alterTable('advertisements', (table) => {
    table.dropColumn('latitude')
    table.dropColumn('longitude')
})

knex.raw('ALTER TABLE advertisements ADD position POINT')
.then(console.log)
.catch(console.log)


