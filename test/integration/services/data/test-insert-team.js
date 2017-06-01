const expect = require('chai').expect
const knexConfig = require('../../../../knexfile').development
const knex = require('knex')(knexConfig)
const config = require('../../../../config')
const insertTeam = require('../../../../app/services/data/insert-team')
const tableName = `${config.DB_APP_SCHEMA}.team`
const Team = require('wmt-probation-rules').Team

describe('app/services/data/insert-team', function () {
  it('should insert a new team record', function () {
    insertTeam(new Team()).then(function (teamId) {
      return knex.table(tableName)
        .where({'id': teamId})
        .first()
        .then(function (result) {
          expect(result['id']).to.not.be.null // eslint-disable-line
          expect(result['ldu_id']).to.be.null // eslint-disable-line
          expect(result['description']).to.be.null // eslint-disable-line
          expect(result['effective_from']).to.be.null // eslint-disable-line
          expect(result['effective_to']).to.be.null // eslint-disable-line
        })
    })
  })

  after(function () {
    return knex(tableName).del()
  })
})
