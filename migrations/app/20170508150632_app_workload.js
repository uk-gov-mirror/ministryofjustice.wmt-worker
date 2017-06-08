
exports.up = function (knex, Promise) {
  return knex.schema.createTable('workload', function (table) {
    table.increments('id')
    table.integer('workload_owner_id').unsigned().references('workload_owner.id')
    table.integer('total_cases').unsigned().notNullable()
    table.integer('total_cases_inactive').unsigned().notNullable()
    table.integer('monthly_sdrs').unsigned().notNullable()
    table.integer('sdr_due_next_30_days').unsigned().notNullable()
    table.integer('active_warrants').unsigned().notNullable()
    table.integer('community_case_total').unsigned().notNullable()
    table.integer('license_case_total').unsigned().notNullable()
    table.integer('custody_tier_total').unsigned().notNullable()
    table.integer('total_cases_ppo').unsigned()
    table.integer('paroms_completed_last_30_days').unsigned().notNullable()
    table.integer('paroms_due_next_30_days').unsigned().notNullable()
    table.integer('lic_16_week_count').unsigned().notNullable()
  }).catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('workload')
}
