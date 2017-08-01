const Promise = require('bluebird')
const config = require('../config')
const log = require('./services/log')
const taskStatus = require('./constants/task-status')
const workloadReportStatus = require('./constants/workload-report-status')
const taskType = require('./constants/task-type')
const getPendingTasksAndMarkInProgress = require('./services/data/get-pending-tasks-and-mark-in-progress')
const updateWorkloadReportStatus = require('./services/data/update-workload-report-with-status')
const countTaskStatuses = require('./services/task-status-counter')
const completeTaskWithStatus = require('./services/data/complete-task-with-status')
const getWorkerForTask = require('./services/get-worker-for-task')
const callWebRefreshEndpoint = require('./services/refresh-web-org-hierarchy')

module.exports = function () {
  var batchSize = parseInt(config.ASYNC_WORKER_BATCH_SIZE, 10)
  return processTasks(batchSize)
}

function processTasks (batchSize) {
  return getPendingTasksAndMarkInProgress(batchSize)
    .then(function (tasks) {
      log.info(`found ${tasks.length} tasks`)
      if (tasks.length === 0) { return }

      var promiseArray = []

      for (var task of tasks) {
        var worker = getWorkerForTask(task.type)

        if (worker) {
          promiseArray.push(executeWorkerForTaskType(worker, task))
        } else {
          log.info(`unable to find worker for task: ${task.type}`)
        }
      }

      return Promise.all(promiseArray)
    })
}

function executeWorkerForTaskType (worker, task) {
  log.info(`started task: ${task.id}-${task.type}`)

  return worker.execute(task)
    .then(function () {
      return completeTaskWithStatus(task.id, taskStatus.COMPLETE)
      .then(function () {
        if (task.type === taskType.CALCULATE_WORKLOAD_POINTS) {
          countTaskStatuses(task).then(function (totals) {
            if (totals.numPending === 0 && totals.numInProgress === 0 && totals.numFailed === 0) {
              updateWorkloadReportStatus(task.id, workloadReportStatus.COMPLETE)
              .then((result) => {
                callWebRefreshEndpoint()
              })
            }
          })
        }
        log.info(`completed task: ${task.id}-${task.type}`)
      })
    }).catch(function (error) {
      log.error(`error running task: ${task.id}-${task.type}, error: ${error}`)
      log.error({error: error})
      if (task.type === taskType.CALCULATE_WORKLOAD_POINTS) {
        updateWorkloadReportStatus(task.workloadReportId, workloadReportStatus.FAILED)
      }
      return completeTaskWithStatus(task.id, taskStatus.FAILED)
    })
}
