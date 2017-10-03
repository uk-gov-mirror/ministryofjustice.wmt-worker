const reductionStatus = require('../../../app/constants/reduction-status')

var tableName = 'reductions'
var workloadOwnerId

exports.seed = function (knex, Promise) {
  return knex(tableName).del()
    .then(function () {
      return knex('workload_owner').select('id').first()
    })
    .then(function (firstWorkloadOwnerId) {
      workloadOwnerId = firstWorkloadOwnerId.id
      return knex('reduction_reason').select('id')
    })
    .then(function (reductionReasonId) {
      var effectiveFromDate = (new Date()).getDate()
      var effectiveToDate = (new Date()).getDate()

      // Create dates for active reduction record
      var activeFromDate = new Date()
      var activeToDate = new Date()
      activeFromDate.setDate(effectiveFromDate - 365)
      activeToDate.setDate(effectiveToDate + 365 * 10)

      // Create dates for scheduled reduction record
      var scheduledFromDate = new Date()
      var scheduleToDate = new Date()
      scheduledFromDate.setDate(effectiveFromDate + 90)
      scheduleToDate.setDate(effectiveToDate + 365 * 10)

      // Create dates for archived reduction record
      var archivedFromDate = new Date()
      var archivedToDate = new Date()
      archivedFromDate.setDate(effectiveFromDate - 360)
      archivedToDate.setDate(effectiveToDate - 365)

      // Create dates for deleted reduction record
      var deletedFromDate = new Date()
      var deletedToDate = new Date()
      deletedFromDate.setDate(effectiveFromDate - 365)
      deletedToDate.setDate(effectiveToDate + 365 * 10)

    // Insert all records into the reduction table
      return knex(tableName).insert([
        { workload_owner_id: workloadOwnerId,
          reduction_reason_id: reductionReasonId[0].id,
          effective_from: activeFromDate,
          effective_to: activeToDate,
          hours: Math.floor(Math.random() * 6) + 1,
          status: reductionStatus.ACTIVE
        },
        { workload_owner_id: workloadOwnerId,
          reduction_reason_id: reductionReasonId[1].id,
          effective_from: scheduledFromDate,
          effective_to: scheduleToDate,
          hours: Math.floor(Math.random() * 6) + 1,
          status: reductionStatus.SCHEDULED
        },
        { workload_owner_id: workloadOwnerId,
          reduction_reason_id: reductionReasonId[2].id,
          effective_from: archivedFromDate,
          effective_to: archivedToDate,
          hours: Math.floor(Math.random() * 6) + 1,
          status: reductionStatus.ARCHIVED
        },
        { workload_owner_id: workloadOwnerId,
          reduction_reason_id: reductionReasonId[2].id,
          effective_from: deletedFromDate,
          effective_to: deletedToDate,
          hours: Math.floor(Math.random() * 6) + 1,
          status: reductionStatus.DELETED
        }
      ])
    })
}
