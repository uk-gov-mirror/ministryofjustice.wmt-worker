const expect = require('chai').expect
const knex = require('../../../../knex').appSchema
const insertOffenderManager = require('../../../../app/services/data/insert-offender-manager')
const OffenderManager = require('wmt-probation-rules').OffenderManager
const moment = require('moment')
const timeThreshold = require('../../../constants/time-threshold')

describe('app/services/data/insert-offender-manager', function () {
  let offenderManagerId

  let typeId
  before(function (done) {
    knex('offender_manager_type').returning('id').insert({ description: 'test' })
      .then(function (id) {
        typeId = id[0]
        done()
      })
  })

  it('should insert a new offender manager record', function (done) {
    const key = '104FD'
    const offenderManager = new OffenderManager(undefined, key, undefined, undefined, typeId, undefined)

    insertOffenderManager(offenderManager).then(function (id) {
      offenderManagerId = id
      return knex.table('offender_manager')
        .where({ id: id })
        .first()
        .then(function (result) {
          expect(result['id']).to.not.be.null // eslint-disable-line
          expect(result['key']).to.eq(key) // eslint-disable-line
          expect(result['forename']).to.be.null // eslint-disable-line
          expect(result['surname']).to.be.null // eslint-disable-line
          expect(result['type_id']).to.eq(typeId) // eslint-disable-line
          expect(moment().diff(result['effective_from'], 'seconds')).to.be.lt(timeThreshold.INSERT) // eslint-disable-line
          expect(result['effective_to']).to.be.null // eslint-disable-line
          done()
        })
    })
  })

  it('should update the grade of an existing offender manager', function (done) {
    const key = '104FD'
    let offenderManager
    let newTypeId

    knex('offender_manager_type').select('id').where('grade_code', 'PO')
      .then(function (id) {
        newTypeId = id[0].id
        offenderManager = new OffenderManager(undefined, key, undefined, undefined, newTypeId, undefined)
        return insertOffenderManager(offenderManager).then(function (id) {
          offenderManagerId = id
          return knex.table('offender_manager')
            .where({ id: id })
            .first()
            .then(function (result) {
              expect(result['id']).to.not.be.null // eslint-disable-line
              expect(result['key']).to.eq(key) // eslint-disable-line
              expect(result['forename']).to.be.null // eslint-disable-line
              expect(result['surname']).to.be.null // eslint-disable-line
              expect(result['type_id']).to.eq(newTypeId) // eslint-disable-line
              expect(result['effective_to']).to.be.null // eslint-disable-line
              done()
            })
        })
      })
  })

  it('should update the forename of an existing offender manager', function (done) {
    const key = '104FD'
    let offenderManager
    let newTypeId
    const newForename = 'A.N'

    knex('offender_manager_type').select('id').where('grade_code', 'PO')
      .then(function (id) {
        newTypeId = id[0].id
        offenderManager = new OffenderManager(undefined, key, newForename, undefined, newTypeId, undefined)
        return insertOffenderManager(offenderManager).then(function (id) {
          offenderManagerId = id
          return knex.table('offender_manager')
            .where({ id: id })
            .first()
            .then(function (result) {
              expect(result['id']).to.not.be.null // eslint-disable-line
              expect(result['key']).to.eq(key) // eslint-disable-line
              expect(result['forename']).to.eq(newForename) // eslint-disable-line
              expect(result['surname']).to.be.null // eslint-disable-line
              expect(result['type_id']).to.eq(newTypeId) // eslint-disable-line
              expect(result['effective_to']).to.be.null // eslint-disable-line
              done()
            })
        })
      })
  })

  it('should update the surname of an existing offender manager', function (done) {
    const key = '104FD'
    let offenderManager
    let newTypeId
    const newForename = 'A.N'
    const newSurname = 'OTHER'

    knex('offender_manager_type').select('id').where('grade_code', 'PO')
      .then(function (id) {
        newTypeId = id[0].id
        offenderManager = new OffenderManager(undefined, key, newForename, newSurname, newTypeId, undefined)
        return insertOffenderManager(offenderManager).then(function (id) {
          offenderManagerId = id
          return knex.table('offender_manager')
            .where({ id: id })
            .first()
            .then(function (result) {
              expect(result['id']).to.not.be.null // eslint-disable-line
              expect(result['key']).to.eq(key) // eslint-disable-line
              expect(result['forename']).to.eq(newForename) // eslint-disable-line
              expect(result['surname']).to.eq(newSurname) // eslint-disable-line
              expect(result['type_id']).to.eq(newTypeId) // eslint-disable-line
              expect(result['effective_to']).to.be.null // eslint-disable-line
              done()
            })
        })
      })
  })

  it('should update staff grade, forename and surname of an existing offender manager', function (done) {
    const key = '104FD'
    let offenderManager
    let newTypeId
    const newForename = 'JOE'
    const newSurname = 'BLOGGS'

    knex('offender_manager_type').select('id').where('grade_code', 'SPO')
      .then(function (id) {
        newTypeId = id[0].id
        offenderManager = new OffenderManager(undefined, key, newForename, newSurname, newTypeId, undefined)
        return insertOffenderManager(offenderManager).then(function (id) {
          offenderManagerId = id
          return knex.table('offender_manager')
            .where({ id: id })
            .first()
            .then(function (result) {
              expect(result['id']).to.not.be.null // eslint-disable-line
              expect(result['key']).to.eq(key) // eslint-disable-line
              expect(result['forename']).to.eq(newForename) // eslint-disable-line
              expect(result['surname']).to.eq(newSurname) // eslint-disable-line
              expect(result['type_id']).to.eq(newTypeId) // eslint-disable-line
              expect(result['effective_to']).to.be.null // eslint-disable-line
              done()
            })
        })
      })
  })

  after(function () {
    return knex('offender_manager').where('id', offenderManagerId).del()
      .then(function () {
        return knex('offender_manager_type').where('id', typeId).del()
      })
  })
})
