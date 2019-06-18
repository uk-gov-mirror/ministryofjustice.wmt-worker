const getReductionNotesDashboard = require('./data/get-reduction-notes-dashboard')
const getFullOverview = require('./data/get-full-overview')
const calculateOverviewValues = require('./helpers/calculate-overview-values')
const getCaseload = require('../services/get-caseload')
const formatDashboardCaseload = require('./helpers/format-dashboard-caseload')
const formatDashboardCapacity = require('./helpers/format-dashboard-capacity')
const pythonDashboard = require('./python-dashboard')

module.exports = function () {
  return getReductionNotesDashboard()
    .then(function (reductionsArray) {
      return getFullOverview()
        .then(function (results) {
          var capacity = calculateOverviewValues(results)
          var capacityArray = formatDashboardCapacity(capacity)
          return getCaseload()
            .then(function (caseloadData) {
              var caseloadArray = formatDashboardCaseload(caseloadData)
              return pythonDashboard(reductionsArray, capacityArray, caseloadArray)
                .then(function (filepath) {
                  return filepath
                })
                .catch(function (error) {
                  throw (error)
                })
            })
        })
    })
}