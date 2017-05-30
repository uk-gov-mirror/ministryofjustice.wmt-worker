const config = require('../../../knexfile').development
const knex = require('knex')(config)
const offenderManagerTable = `${config.DB_STG_SCHEMA}.offender_manager`

module.exports = function (offenderManager) {
  var offenderManagerId

  knex.select().from(offenderManagerTable)
    .where('om_key', offenderManager.omKey)
    .first()
    .then(function (result) {
      if (result === 'undefined') {
        offenderManagerId = knex(offenderManagerTable)
          .insert(offenderManager)
          .returning('id')
      }
      return offenderManagerId
    })
}
