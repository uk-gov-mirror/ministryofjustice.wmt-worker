const knexConfig = require('../../../knexfile').app
const knex = require('knex')(knexConfig)

module.exports = function (courtReports) {
  var courtReportsDbObject = mapToDbObject(courtReports)

  return knex('court_reports')
    .insert(courtReportsDbObject)
    .returning('id')
    .finally(function() {
      knex.destroy()
    })
}

var mapToDbObject = function (courtReports) {
  return {
    workload_owner_id: courtReports.workloadOwnerId,
    workload_report_id: courtReports.workloadReportId,
    staging_id: courtReports.stagingId,
    total_sdrs: courtReports.totalSdrs,
    total_fdrs: courtReports.totalFdrs,
    total_oral_reports: courtReports.totalOralReports
  }
}
