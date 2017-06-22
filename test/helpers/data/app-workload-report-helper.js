const knexConfig = require('../../../knexfile').app
const knex = require('knex')(knexConfig)
var Promise = require('bluebird').Promise

module.exports.insertDependencies = function (inserts) {
  return knex('workload_report').returning('id').insert({})
    .then(function (ids) {
      inserts.push({table: 'workload_report', id: ids[0]})
      return inserts
    })
    .catch((error) => {
      console.error(error)
      exports.removeDependencies(inserts)
    })
}

module.exports.removeDependencies = function (inserts) {
  inserts = inserts.reverse()

  return Promise.each(inserts, (deletion) => {
    return knex(deletion.table).whereIn('id', deletion.id).del()
  })
}