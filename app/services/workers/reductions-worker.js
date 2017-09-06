const getAllOpenReductions = require('../data/get-all-open-reductions')
const updateReductionStatusByIds = require('../data/update-reduction-status-by-ids')
const reductionStatus = require('../../constants/reduction-status')
const createNewTasks = require('../data/create-tasks')
const taskType = require('../../constants/task-type')
const taskStatus = require('../../constants/task-status')
const Task = require('../domain/task')
const submittingAgent = require('../../constants/task-submitting-agent')
const logger = require('../log')

module.exports.execute = function (task) {
  console.log(task)
  var idsMap = new Map()
  idsMap.set(reductionStatus.ACTIVE, [])
  idsMap.set(reductionStatus.SCHEDULED, [])
  idsMap.set(reductionStatus.DELETED, [])
  idsMap.set(reductionStatus.ARCHIVED, [])

  logger.info('Retrieving open reductions')
  return getAllOpenReductions()
    .then(function (results) {
      results.forEach(function (reduction) {
        status = getReducitonStatus(reduction)
        ids = idsMap.get(status)
        ids.push(reduction.id)
        idsMap.set(status, ids)
      })

      var updateReductionsPromises = []
      for (var [status, ids] of idsMap) {
        logger.info('Updating status to ' + status + ' for reductions with id in ' + ids)
        updateReductionsPromises.push(updateReductionStatusByIds(ids, status))
      }

      return Promise.all(updateReductionsPromises)
      .then(function () {
        var calculateWorkloadPointsTask = new Task(
          undefined,
          submittingAgent.WORKER,
          taskType.CALCULATE_WORKLOAD_POINTS,
          task.additionalDetails,
          task.workloadReportId,
          undefined,
          undefined,
          taskStatus.PENDING
          )
        console.log(calculateWorkloadPointsTask)
        return createNewTasks([calculateWorkloadPointsTask])
        .then(function () {
          logger.info('Tasks created')
        })
      })
    })
}

var getReducitonStatus = function (reduction) {
  var status = reductionStatus.DELETED

  var currentTime = new Date().getTime()
  var reductionStartTime = reduction.reductionStartDate.getTime()
  var reductionEndTime = reduction.reductionEndDate.getTime()

  if (reductionStartTime < currentTime && reductionEndTime < currentTime) {
    status = reductionStatus.ARCHIVED
  } else if (reductionStartTime < currentTime && reductionEndTime > currentTime) {
    status = reductionStatus.ACTIVE
  } else if (reductionStartTime > currentTime && reductionEndTime > currentTime) {
    status = reductionStatus.SCHEDULED
  }

  return status
}
