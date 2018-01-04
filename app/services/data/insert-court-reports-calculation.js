const knexConfig = require('../../../knexfile').app
const knex = require('knex')(knexConfig)

module.exports = function (courtReportCalculation) {
  var dbObject = mapToDbObject(courtReportCalculation)

  return knex('court_reports_calculations')
    .returning('id')
    .insert(dbObject)
    .finally(function() {
      knex.destroy()
    })
}

var mapToDbObject = function (courtReportCalculation) {
  return {
    workload_report_id: courtReportCalculation.workloadReportId,
    workload_points_id: courtReportCalculation.workloadPointsId,
    court_reports_id: courtReportCalculation.courtReportsId,
    contracted_hours: courtReportCalculation.contractedHours,
    reduction_hours: courtReportCalculation.reductionHours
  }
}
