const logger = require('../log')
const dashboard = require('../dashboard')

module.exports.execute = function (task) {
  return dashboard()
    .then(function (filepath) {
      logger.info('GENERATE DASHBOARD - Dashboard Saved to', filepath)
    }).catch(function (error) {
      logger.error('GENERATE DASHBOARD - Unable to Generate Dashboard')
      logger.error(error)
      throw (error)
    })
}
