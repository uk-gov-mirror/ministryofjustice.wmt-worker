const knexConfig = require('../../../knexfile').staging
const knex = require('knex')(knexConfig)

module.exports = function () {
  return knex('court_reports')
  .leftJoin('wmt_extract', function () {
    this.on('wmt_extract.om_key', 'court_reports.om_key')
    .andOn('wmt_extract.team_code', 'court_reports.team_code')
  })
  .select(
    'court_reports.trust'
    , 'court_reports.region_desc'
    , 'court_reports.region_code'
    , 'court_reports.ldu_desc'
    , 'court_reports.ldu_code'
    , 'court_reports.team_desc'
    , 'court_reports.team_code'
    , 'court_reports.om_surname'
    , 'court_reports.om_forename'
    , 'court_reports.om_grade_code'
    , 'court_reports.om_key'
    , 'court_reports.sdr_last_30'
    , 'court_reports.sdr_due_next_30'
    , 'court_reports.sdr_conv_last_30'
    , 'court_reports.oral_reports'
    , 'court_reports.datestamp'
  )
  .whereNull('wmt_extract.id')
  .finally(function() {
    knex.destroy()
  })
}
