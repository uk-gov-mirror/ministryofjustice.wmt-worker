var Promise = require('bluebird').Promise
const logger = require('../log')
const calculateTotalWorkloadPoints = require('wmt-probation-rules').calculateTotalWorkloadPoints
const calculateSdrConversionPoints = require('wmt-probation-rules').calculateSdrConversionPoints
const calculateNominalTarget = require('wmt-probation-rules').calculateNominalTarget
const calculateParomPoints = require('wmt-probation-rules').calculateParomPoints
const calculateAvailablePoints = require('wmt-probation-rules').calculateAvailablePoints
const getAppWorkloads = require('../../services/data/get-app-workloads')
const insertWorkloadPointsCalculations = require('../../services/data/insert-workload-points-calculation')
const getWorkloadPointsConfiguration = require('../../services/data/get-workload-points-configuration')
const getOffenderManagerTypeId = require('../../services/data/get-offender-manager-type-id')

module.exports.execute = function (task) {
  // TODO hardcoded until we play the reductions story
  var reductions = 0
  var contractedHours = 40

  var id = task.additionalData.workloadBatch.startingId
  var batchSize = task.additionalData.workloadBatch.batchSize
  var reportId = task.additionalData.reportId

  logger.info('Calculating Workload Points for Workloads ' + id + ' - ' + (id + batchSize))
  var pointsConfgiurationPromise = getWorkloadPointsConfiguration()

  return getAppWorkloads(id, batchSize).then(function (workloads) {
    return Promise.each(workloads, function (workloadResult) {
      var workload = workloadResult.values
      var workloadId = workloadResult.id
      var getOffenderManagerTypePromise = getOffenderManagerTypeId(workload.workloadOwnerId)
      return pointsConfgiurationPromise.then(function (pointsConfiguration) {
        var caseTypeWeightings = pointsConfiguration.values

        var sdrConversionPoints = calculateSdrConversionPoints(workload.sdrConversionsLast30Days, caseTypeWeightings.pointsConfiguration.sdrConversion)
        var sdrPoints = calculateSdrConversionPoints(workload.monthlySdrs, caseTypeWeightings.pointsConfiguration.sdr)
        var totalWorkloadPoints = calculateTotalWorkloadPoints(workload, caseTypeWeightings)
        var paromsPoints = calculateParomPoints(workload.paromsCompletedLast30Days, caseTypeWeightings.pointsConfiguration.parom, caseTypeWeightings.pointsConfiguration.paromsEnabled)

        return getOffenderManagerTypePromise.then(function (offenderManagerTypeId) {
          var nominalTarget = calculateNominalTarget(offenderManagerTypeId, caseTypeWeightings.pointsConfiguration.defaultNominalTargets)
          var availablePoints = calculateAvailablePoints(nominalTarget, offenderManagerTypeId, contractedHours, reductions, caseTypeWeightings.pointsConfiguration.defaultContractedHours)

          return insertWorkloadPointsCalculations(reportId, pointsConfiguration.id, workloadId, totalWorkloadPoints,
                sdrPoints, sdrConversionPoints, paromsPoints, nominalTarget, availablePoints)
        })
      })
    })
  }).catch(function (error) {
    logger.error('Unable to retrieve workloads with IDs ' + id + ' - ' + (id + batchSize))
    logger.error(error)
  })
}
