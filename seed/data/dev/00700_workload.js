var tableName = 'workload'

const workloadRow = { workload_owner_id: 1, total_cases: 63, monthly_sdrs: 10, sdr_due_next_30_days: 10, sdr_conversions_last_30_days: 10, total_community_cases: 21, total_custody_cases: 21, total_license_cases: 21, paroms_completed_last_30_days: 5, paroms_due_next_30_days: 5, license_last_16_weeks: 9, community_last_16_weeks: 10 }

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  var partOneWorkloads = []
  var partTwoWorkloads = []
  var partThreeWorkloads = []
  var partFourWorkloads = []
  return knex(tableName).del()
    .then(function () {
      return knex('workload_owner').select('id')
    })
    .then(function (workloadOwners) {
      var workloadsToInsert = []
      for (var workloadOwner in workloadOwners) {
        for (var i = 0; i < 10; i++) {
          workloadsToInsert.push(Object.assign({}, workloadRow, {workload_owner_id: workloadOwners[workloadOwner].id}))
        }
      }
      // Need to split the array into 4 as one query caused an error with too many parameters in one request (2100)
      var oneQuarterValue = workloadsToInsert.length / 4
      var twoQuarterValue = oneQuarterValue * 2
      var threeQuarterValue = oneQuarterValue * 3
      partOneWorkloads = workloadsToInsert.slice(0, oneQuarterValue)
      partTwoWorkloads = workloadsToInsert.slice(oneQuarterValue, twoQuarterValue)
      partThreeWorkloads = workloadsToInsert.slice(twoQuarterValue, threeQuarterValue)
      partFourWorkloads = workloadsToInsert.slice(threeQuarterValue, workloadsToInsert.length - 1)
      return knex('workload').insert(partOneWorkloads)
        .then(function (results) {
          return knex('workload').insert(partTwoWorkloads)
            .then(function (results) {
              return knex('workload').insert(partThreeWorkloads)
                .then(function (results) {
                  return knex('workload').insert(partFourWorkloads)
                })
            })
        })
    })
}