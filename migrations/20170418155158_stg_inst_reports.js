
exports.up = function (knex, Promise) {
  return knex.schema.withSchema('staging').createTable('stg_inst_reports', function (table) {
    table.increments('id')
    table.string('om_team_staff_grade')
    table.string('parom_due_next_30')
    table.string('parom_comp_last_30')
  }).catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  knex.schema.withSchema('staging').dropTable('stg_inst_reports')
}
