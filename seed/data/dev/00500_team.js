var tableName = 'team'

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(tableName).del()
    .return(knex('ldu').select('id').limit(3))
    .then(function (results) {
      var lduIds = results
      // Inserts seed entries
      return knex(tableName).insert([
        { description: 'Team 1', ldu_id: lduIds[0].id },
        { description: 'Team 2', ldu_id: lduIds[1].id },
        { description: 'Team 3', ldu_id: lduIds[2].id },
        { description: 'Team 4', ldu_id: lduIds[0].id },
        { description: 'Team 5', ldu_id: lduIds[1].id },
        { description: 'Team 6', ldu_id: lduIds[2].id }
      ])
    })
}