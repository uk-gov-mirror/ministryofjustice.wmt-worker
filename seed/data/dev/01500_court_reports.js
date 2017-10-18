var tableName = 'court_reports'

const workloadRow = {
  workload_owner_id: 1,
  total_sdrs: 10,
  total_fdrs: 11,
  total_oral_reports: 12
}

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(tableName).del()
    .then(function () {
      return knex('workload_owner').select('workload_owner.id')
      .join('team', 'team.id', 'workload_owner.team_id').where('team.description', 'CR Team 1')
    })
    .then(function (workloadOwners) {
      var workloadsToInsert = []
      for (var workloadOwner in workloadOwners) {
        for (var i = 0; i < 5; i++) {
          workloadsToInsert.push(Object.assign({}, workloadRow, {workload_owner_id: workloadOwners[workloadOwner].id, staging_id: i + 1}))
        }
      }
      return knex(tableName).insert(workloadsToInsert)
    })
}
