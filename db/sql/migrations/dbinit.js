var knex = require('../../knex')

var sampleUsers = [{
    name: "Robert Downey Jr.",
    email: "iam_ironMan@outlook.com",
    role: 1
},{
    name: "Steve Summers",
    email: "summers_steve89@gmail.com",
    role: 0
},{
    name: "John Lenon",
    email: "jlenon3@gmail.com",
    role: 0
},{
    name: "Doug Dimmadome",
    email: "dimsdale_DimmaDome@dimmadome.com",
    role: 1
}]

var sampleAds = [{
    caption: "New Jollibee ChickenJoy a la Queen: 75 pesos lang!",
    user_id: 1
},{
    caption: "Dimmsdale Dimmadome Rental",
    user_id: 4
}]

// Creates a user table
knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.integer('role').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.createTable('advertisements', (table) => {
    table.increments('id').primary()
    table.string('caption').notNullable()
    table.integer('user_id').unsigned().references('users.id')
    table.float('latitude',10,6)
    table.float('longitude',10,6)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.createTable('reports', (table) => {
    table.increments('id').primary()
    table.integer('type').notNullable()
    table.integer('votes').defaultTo(0).comment("This is the number of upvotes")
    table.integer('user_id').unsigned().references('users.id')
    table.float('latitude',10,6)
    table.float('longitude',10,6)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.createTable('comments', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().references('users.id')
    table.integer('report_id').unsigned().references('reports.id')
    table.string('text')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})
.then(console.log)
.catch(console.log)

// knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [sampleUsers[0].name,sampleUsers[0].email,sampleUsers[0].role])
// knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [sampleUsers[0].name,sampleUsers[0].email,sampleUsers[0].role])
// knex.raw('INSERT INTO users (name, email, role) VALUES (?,?,?)', [sampleUsers[0].name,sampleUsers[0].email,sampleUsers[0].role])
