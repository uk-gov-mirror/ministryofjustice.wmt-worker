const expect = require('chai').expect
const knexConfig = require('../../../../knexfile').app
const knex = require('knex')(knexConfig)
const appWorkloadOwnerHelper = require('../../../helpers/data/app-workload-owner-helper')
const appAdjustmentsHelper = require('../../../helpers/data/app-adjustments-helper')
const updateAdjustmentEffectiveTo = require('../../../../app/services/data/update-adjustment-effective-to')

var inserts = []
var newDate = new Date(2020, 11, 17)

describe('services/data/update-adjustment-effective-to', function () {
  before(function () {
    return appWorkloadOwnerHelper.insertDependencies(inserts)
    .then(function (builtInserts) {
      return appAdjustmentsHelper.insertDependencies(inserts)
      .then(function (builtInserts) {
        inserts = builtInserts
      })
    })
  })

  it('should update effectiveTo of adjustment', function () {
    var adjustmentId = inserts.filter((item) => item.table === 'adjustments')[0].id
    return updateAdjustmentEffectiveTo(adjustmentId, newDate)
    .then(function (updatedId) {
      expect(updatedId).to.be.equal(adjustmentId)
      return knex('adjustments').select('effective_to').where('id', updatedId)
      .then(function (adjustments) {
        expect(adjustments[0].effective_to).to.be.eql(newDate)
      })
    })
  })

  after(function () {
    return appAdjustmentsHelper.removeDependencies(inserts)
  })
})
