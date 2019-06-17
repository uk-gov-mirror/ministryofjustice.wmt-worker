module.exports = function (capacity) {
  capacityArray = []
  capacity.forEach(function (record) {
    capacityArray.push([
      record.regionName,
      record.lduCluster,
      record.teamName,
      record.offenderManager,
      record.gradeCode,
      record.capacityPercentage,
      record.totalPoints,
      record.remainingPoints,
      record.contractedHours,
      record.reductionHours,
      record.totalCases,
      record.cmsAdjustmentPoints,
      record.cmsPercentage
    ])
  })
  return capacityArray
}
