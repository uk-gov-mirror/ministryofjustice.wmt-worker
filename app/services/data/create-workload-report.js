// Update previous report to effective_to = now and mark new report with effective_from now
const config = require('../../../config')
const knexConfig = require('../../../knexfile').development
const knex = require('knex')(knexConfig)
const taskStatus = require('../../constants/task-status')


module.exports = function (workloadId, effectiveFrom) {
  var workloadPointsId = 0
  return knex(`${config.DB_APP_SCHEMA}.workload_report`)
    .select()
    .where('id', workloadId)
    .then(function (result) {
      if (result !== undefined) {
        knex('tasks').whereId('id', workloadId)
          .update('effectiveTo', effectiveFrom)
      }
      knex()
        .insert({effective_from: effectiveFrom, status: taskStatus.COMPlETE, description: taskStatus.COMPLETE})
        .then(function (result) {
          workloadPointsId = result.id
        })

      return workloadPointsId
    })
}
