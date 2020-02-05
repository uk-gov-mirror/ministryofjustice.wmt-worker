var Promise = require('bluebird').Promise
const logger = require('../log')
const calculateWorkloadPoints = require('wmt-probation-rules').calculateWorkloadPoints
const calculateNominalTarget = require('wmt-probation-rules').calculateNominalTarget
const calculateAvailablePoints = require('wmt-probation-rules').calculateAvailablePoints
const parseOmicAppWorkloads = require('../parse-omic-app-workloads')
const insertOmicWorkloadPointsCalculations = require('../data/insert-omic-workload-points-calculation')
const updateOmicWorkloadPointsCalculations = require('../data/update-omic-workload-points-calculation')
const getWorkloadPointsConfiguration = require('../data/get-workload-points-configuration')
const getOffenderManagerTypeId = require('../data/get-offender-manager-type-id')
const getContractedHours = require('../data/get-contracted-hours')
const operationTypes = require('../../constants/calculation-tasks-operation-type')
const checkForDuplicateCalculation = require('../data/check-for-duplicate-calculation')

module.exports.execute = function (task) {
  var startingStagingId = task.additionalData.workloadBatch.startingId
  var batchSize = task.additionalData.workloadBatch.batchSize
  var reportId = task.workloadReportId
  var operationType = task.additionalData.operationType
  var maxStagingId = startingStagingId + batchSize - 1
  var message

  if (batchSize <= 0) {
    logger.error('Batchsize must be greater than 0')
    throw (new Error('Batchsize must be greater than 0'))
  } else if (batchSize > 1) {
    message = 'Calculating Workload Points for workloads with staging ids ' + startingStagingId + ' - ' + maxStagingId + ', for workload report ' + reportId
  } else {
    message = 'Calculating Workload Points for workload with staging id ' + startingStagingId + ', for workload report ' + reportId
  }
  logger.info(message)

  var isT2a = false
  var pointsConfigurationPromise = getWorkloadPointsConfiguration(isT2a)
  isT2a = true
  var t2aPointsConfigurationPromise = getWorkloadPointsConfiguration(isT2a)

  return parseOmicAppWorkloads(startingStagingId, maxStagingId, batchSize, reportId).then(function (workloads) {
    return Promise.each(workloads, function (workloadResult) {
      var workload = workloadResult.values
      var workloadId = workloadResult.id
      var getOffenderManagerTypePromise = getOffenderManagerTypeId(workload.workloadOwnerId)
      var getContractedHoursPromise = getContractedHours(workload.workloadOwnerId)

      return pointsConfigurationPromise.then(function (pointsConfiguration) {
        var caseTypeWeightings = pointsConfiguration.values
        return t2aPointsConfigurationPromise.then(function (t2aPointsConfiguration) {
          var t2aCaseTypeWeightings = t2aPointsConfiguration.values
          var workloadPointsBreakdown = calculateWorkloadPoints(workload, caseTypeWeightings, t2aCaseTypeWeightings)
          var totalPoints = workloadPointsBreakdown.total
          return getContractedHoursPromise.then(function (contractedHours) {
            return getOffenderManagerTypePromise.then(function (offenderManagerTypeId) {
              var nominalTarget = calculateNominalTarget(offenderManagerTypeId, caseTypeWeightings.pointsConfiguration.defaultNominalTargets)
              var availablePoints = calculateAvailablePoints(nominalTarget, offenderManagerTypeId, contractedHours,
                reductions, caseTypeWeightings.pointsConfiguration.defaultContractedHours)
              if (availablePoints === null) {
                availablePoints = 0
              }
              var armsTotalCases = workload.armsCommunityCases + workload.armsLicenseCases
              return checkForDuplicateCalculation(reportId, workloadId)
                .then(function (result) {
                  // check if calculation already exists when the operatioType is INSERT
                  // no need to do this change anything if the operationType is UPDATE
                  if (operationType === operationTypes.INSERT && result !== undefined) {
                    operationType = operationTypes.UPDATE
                  }
                  switch (operationType) {
                    case operationTypes.INSERT:
                      return insertOmicWorkloadPointsCalculations(
                              reportId,
                              pointsConfiguration.id,
                              t2aPointsConfiguration.id,
                              workloadId,
                              workloadPointsBreakdown.custodyTierPoints,
                              workloadPointsBreakdown.licenseTierPoints,
                              workloadPointsBreakdown.sdrPoints,
                              workloadPointsBreakdown.sdrConversionPoints,
                              workloadPointsBreakdown.paromsPoints,
                              nominalTarget,
                              availablePoints,
                              contractedHours,
                              reductions,
                              cmsAdjustments,
                              gsAdjustments,
                              armsTotalCases)

                    case operationTypes.UPDATE:
                      return updateOmicWorkloadPointsCalculations(
                              reportId,
                              pointsConfiguration.id,
                              t2aPointsConfiguration.id,
                              workloadId,
                              totalPoints,
                              workloadPointsBreakdown.sdrPoints,
                              workloadPointsBreakdown.sdrConversionPoints,
                              workloadPointsBreakdown.paromsPoints,
                              nominalTarget,
                              availablePoints,
                              contractedHours,
                              reductions,
                              cmsAdjustments,
                              gsAdjustments,
                              armsTotalCases)
                    default:
                      throw new Error('Operation type of ' + operationType + ' is not valid. Should be ' + operationTypes.INSERT + ' or ' + operationTypes.UPDATE)
                  }
                })
            })
          })
        })
      }).catch(function (error) {
        logger.error('Unable to retrieve workloads with staging ids ' + startingStagingId + ' - ' + maxStagingId + ', for workload report ' + reportId)
        logger.error(error)
        throw (error)
      })
    })
  })
}
