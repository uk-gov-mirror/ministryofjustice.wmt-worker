const knexConfig = require('../../../knexfile').development
const knex = require('knex')(knexConfig)

module.exports = function (workloadOwnerId) {
  return knex('reductions').withSchema('app')
    .sum('hours')
    .where('workload_owner_id', workloadOwnerId)
    .where('effective_from', '<=', knex.fn.now())
    .andWhere('effective_to', '>=', knex.fn.now())
    .then((result) => result)
}
