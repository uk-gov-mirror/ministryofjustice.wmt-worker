const knexConfig = require('../../../knexfile').app
const knex = require('knex')(knexConfig)

const adjustmentStatus = require('../../constants/adjustment-status')

module.exports = function (category, workloadIdStart, workloadIdEnd) {
  return knex('adjustments')
    .join('adjustment_reason', 'adjustment_reason.id', 'adjustments.adjustment_reason_id')
    .join('workload', 'workload.workload_owner_id', 'adjustments.workload_owner_id')
    .andWhere('status', adjustmentStatus.ACTIVE)
    .andWhere('adjustment_reason.category_id', category)
    .andWhereBetween('workload.id', [workloadIdStart, workloadIdEnd])
    .select('adjustments.id AS id',
      'adjustments.workload_owner_id AS workloadOwnerId',
      'adjustments.contact_id AS contactId',
      'adjustments.points AS points',
      'adjustments.adjustment_reason_id AS adjustmentReasonId',
      'adjustments.effective_from AS effectiveFrom',
      'adjustments.effective_to AS effectiveTo',
      'adjustments.status AS status')
}