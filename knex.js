const knexAppSchema = require('knex')(require('./knexfile').app)
const knexStagingSchema = require('knex')(require('./knexfile').staging)
const knexArchive = require('knex')(require('./knexfile').archive)

module.exports = {
  appSchema: knexAppSchema,
  stagingSchema: knexStagingSchema,
  archive: knexArchive
}
