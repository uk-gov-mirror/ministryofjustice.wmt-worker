var Promise = require('bluebird').Promise
const logger = require('../log')
const calculateWorkloadPoints = require('wmt-probation-rules').calculateWorkloadPoints
const calculateSdrConversionPoints = require('wmt-probation-rules').calculateSdrConversionPoints
const calculateNominalTarget = require('wmt-probation-rules').calculateNominalTarget
const calculateParomPoints = require('wmt-probation-rules').calculateParomPoints
const calculateAvailablePoints = require('wmt-probation-rules').calculateAvailablePoints
const getAppWorkloads = require('../data/get-app-workloads')
const insertWorkloadPointsCalculations = require('../data/insert-workload-points-calculation')
const updateWorkloadPointsCalculations = require('../data/update-workload-points-calculation')
const getWorkloadPointsConfiguration = require('../data/get-workload-points-configuration')
const getOffenderManagerTypeId = require('../data/get-offender-manager-type-id')
const getAppReductions = require('../data/get-app-reductions')
const getContractedHours = require('../data/get-contracted-hours')
const wpcOperationType = require('../../constants/calculate-workload-points-operation')

module.exports.execute = function (task) {
  var id = task.additionalData.workloadBatch.startingId
  var batchSize = task.additionalData.workloadBatch.batchSize
  var reportId = task.workloadReportId
  var operationType = task.additionalData.operationType
  var maxId = id
  var message

  if (batchSize <= 0) {
    logger.error('Batchsize must be greater than 0')
    throw (new Error('Batchsize must be greater than 0'))
  } else if (batchSize > 1) {
    maxId = id + batchSize - 1
    message = 'Calculating Workload Points for Workloads ' + id + ' - ' + (id + batchSize)
  } else {
    message = 'Calculating Workload Points for Workload ' + id
  }
  logger.info(message)

  var pointsConfigurationPromise = getWorkloadPointsConfiguration()

  return getAppWorkloads(id, maxId, batchSize).then(function (workloads) {
    return Promise.each(workloads, function (workloadResult) {
      var workload = workloadResult.values
      var workloadId = workloadResult.id
      var getOffenderManagerTypePromise = getOffenderManagerTypeId(workload.workloadOwnerId)
      var getAppReductionsPromise = getAppReductions(workload.workloadOwnerId)
      var getContractedHoursPromise = getContractedHours(workload.workloadOwnerId)

      return pointsConfigurationPromise.then(function (pointsConfiguration) {
        var caseTypeWeightings = pointsConfiguration.values
        var sdrConversionPoints = calculateSdrConversionPoints(workload.sdrConversionsLast30Days, caseTypeWeightings.pointsConfiguration.sdrConversion)
        var sdrPoints = calculateSdrConversionPoints(workload.monthlySdrs, caseTypeWeightings.pointsConfiguration.sdr)
        var paromsPoints = calculateParomPoints(workload.paromsCompletedLast30Days, caseTypeWeightings.pointsConfiguration.parom, caseTypeWeightings.pointsConfiguration.paromsEnabled)
        var workloadPoints = calculateWorkloadPoints(workload, caseTypeWeightings)
        var totalPoints = (workloadPoints + sdrConversionPoints + sdrPoints + paromsPoints)
        return getAppReductionsPromise.then(function (reductions) {
          return getContractedHoursPromise.then(function (contractedHours) {
            return getOffenderManagerTypePromise.then(function (offenderManagerTypeId) {
              var nominalTarget = calculateNominalTarget(offenderManagerTypeId, caseTypeWeightings.pointsConfiguration.defaultNominalTargets)
              var availablePoints = calculateAvailablePoints(nominalTarget, offenderManagerTypeId, contractedHours,
                  reductions, caseTypeWeightings.pointsConfiguration.defaultContractedHours)
              switch (operationType) {
                case wpcOperationType.INSERT:
                  return insertWorkloadPointsCalculations(reportId, pointsConfiguration.id, workloadId, totalPoints,
                    sdrPoints, sdrConversionPoints, paromsPoints, nominalTarget, availablePoints, reductions, contractedHours)
                case wpcOperationType.UPDATE:
                  return updateWorkloadPointsCalculations(reportId, pointsConfiguration.id, workloadId, totalPoints,
                    sdrPoints, sdrConversionPoints, paromsPoints, nominalTarget, availablePoints, reductions, contractedHours)
                default:
                  throw new Error('Operation type of ' + operationType + ' is not valid. Should be ' + wpcOperationType.INSERT + ' or ' + wpcOperationType.UPDATE)
              }
            })
          })
        })
      })
    })
  }).catch(function (error) {
    logger.error('Unable to retrieve workloads with IDs ' + id + ' - ' + (id + batchSize))
    logger.error(error)
    throw (error)
  })
}
