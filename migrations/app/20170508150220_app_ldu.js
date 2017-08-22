
exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists('ldu', function (table) {
    table.increments('id')
    table.string('code')
    table.string('description')
    table.integer('region_id').unsigned().notNullable().references('region.id')
    table.timestamp('effective_from').defaultTo(knex.fn.now())
    table.timestamp('effective_to')
  }).catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ldu')
}
