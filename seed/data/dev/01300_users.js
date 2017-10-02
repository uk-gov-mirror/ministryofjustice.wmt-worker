var tableName = 'users'

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(tableName).del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName).insert([
        { username: 'Manager.Test' },
        { username: 'System.AdminTest' },
        { username: 'Data.AdminTest' }
      ])
    })
}
