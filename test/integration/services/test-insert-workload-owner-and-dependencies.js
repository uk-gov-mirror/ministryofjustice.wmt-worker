const expect = require('chai').expect
const knex = require('../../../knex').appSchema
const insertWorkloadOwnerAndDependencies = require('../../../app/services/insert-workload-owner-and-dependencies')
const CasesSummary = require('wmt-probation-rules').CasesSummary
const log = require('/../../../app/services/log')

describe('app/services/insert-workload-owner-and-dependencies', function () {
  
    var omGradeCode
    var omKey
    var omForename
    var omSurname
    var regionCode
    var regionDesc
    var lduCode
    var lduDesc
    var teamCode
    var teamDesc
    var contractedHours
    var offenderManagerId

  it('should insert a new offender manager record', function (done) {
    omGradeCode = 'D'
    omKey = 'N63D897'
    omForename = 'INTEGRATION'
    omSurname = 'TEST'
    regionCode = 'N63'
    regionDesc = 'NPS INTEGRATION TEST'
    lduCode = 'N63ALL'
    lduDesc = 'ALL NPS INTEGRATION TEST'
    teamCode = 'N63959'
    teamDesc = 'NPS TEAM INTEGRATION TEST'
    contractedHours = 37

    var caseSummary = new CasesSummary(null, regionDesc, regionCode, lduDesc, lduCode, teamDesc, teamCode, omSurname, omForename, omGradeCode, omKey)

    insertWorkloadOwnerAndDependencies(caseSummary).then(function () {
      return knex.table('offender_manager')
        .where({'key': omKey})
        .first()
        .then(function (omRecord) {
          offenderManagerId = omRecord['id']
          expect(omRecord['id']).to.not.be.null 
          expect(omRecord['key']).to.eq(omKey)
          expect(omRecord['forename']).to.eq(omForename)
          expect(omRecord['surname']).to.eq(omSurname)
          return knex.table('region')
            .where('code', regionCode)
            .first()
            .then(function (regionRecord) {
              log.info(regionRecord['code'])
              expect(regionRecord['code']).to.eq(regionCode)
              expect(regionRecord['description']).to.eq(regionDesc)
              return knex.table('ldu')
                .where('code', lduCode)
                .first()
                .then(function (lduRecord) {
                  expect(lduRecord['region_id']).to.eq(regionRecord['id'])
                  expect(lduRecord['code']).to.eq(lduCode)
                  expect(lduRecord['description']).to.eq(lduDesc)
                  return knex.table('team')
                    .where('code', teamCode)
                    .first()
                    .then(function (teamRecord) {
                      expect(teamRecord['ldu_id']).to.eq(lduRecord['id'])
                      expect(teamRecord['code']).to.eq(teamCode)
                      expect(teamRecord['description']).to.eq(teamDesc)
                      return knex.table('workload_owner')
                        .where('offender_manager_id', omRecord['id'])
                        .first()
                        .then(function (woRecord) {
                          log.info(woRecord)
                          expect(woRecord['offender_manager_id']).to.eq(omRecord['id'])
                          expect(woRecord['contracted_hours']).to.eq(contractedHours)
                          expect(woRecord['team_id']).to.eq(teamRecord['id'])
                          done()
                      })
                   })
                })
            })      
        })
    })
  })

  after(function () {
    return knex('workload_owner').where('offender_manager_id', offenderManagerId).del()
      .then(function () {
        return knex('offender_manager').where('id', offenderManagerId).del()
        .then (function () {
          return knex('team').where('code', teamCode).del()
          .then (function () {
            return knex('ldu').where('code', lduCode).del()
            .then (function () {
              return knex('region').where('code', regionCode).del()
            })
          })
        })
      })
  })
})
