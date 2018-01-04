const knexConfig = require('../../../knexfile').staging
const knex = require('knex')(knexConfig)
const IdRange = require('../domain/id-range')

module.exports = function () {
  return knex('court_reporters').max('id AS last_id').min('id AS first_id')
    .then(function (results) {
      return new IdRange(results[0].first_id, results[0].last_id)
    })
    .finally(function() {
      knex.destroy()
    })
}
