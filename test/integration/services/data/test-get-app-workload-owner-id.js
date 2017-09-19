const expect = require('chai').expect
const knexConfig = require('../../../../knexfile').app
const knex = require('knex')(knexConfig)

const appWorkloadOwnerHelper = require('../../../helpers/data/app-workload-owner-helper')
const appReductionsHelper = require('../../../helpers/data/app-reductions-helper')

const getWorkloadOwnerId = require('../../../../app/services/data/get-app-workload-owner-id')

var inserts = []

describe('services/data/get-workload-owner-id', function () {
  before(function () {
    return appWorkloadOwnerHelper.insertDependencies(inserts)
    .then(function (builtInserts) {
      inserts = builtInserts
    })
  })

  it('should retrieve the workload owner id workload owner', function () {
    var workloadOwnerId = inserts.filter((item) => item.table === 'workload_owner')[0].id
    var omId = inserts.filter((item) => item.table === 'offender_manager')[0].id

    return knex('offender_manager').where('id', omId).first('key')
    .then(function (offenderManagerKey) {
      var teamId = inserts.filter((item) => item.table === 'team')[0].id
      return knex('team').where('id', teamId).first('code')
      .then(function (teamCode) {
        return getWorkloadOwnerId(offenderManagerKey.key, teamCode.code)
        .then(function (result) {
          expect(result).to.be.equal(workloadOwnerId)
        })
      })
    })
  })

  after(function () {
    return appReductionsHelper.removeDependencies(inserts)
  })
})
