const config = require('./knexfile').archive
const knex = require('knex')(config)
const glob = require('glob')
const Promise = require('bluebird').Promise

var seedViewFileNames = glob.sync('./seed/archive-views/[0...9]*.js')

var databaseViewNames = seedViewFileNames.sort().reverse()
    .map((fileName) => fileName.substring(fileName.lastIndexOf('/') + 7, fileName.lastIndexOf('.')))

Promise.each(databaseViewNames, (viewName) =>
     knex.schema.raw('DROP VIEW IF EXISTS dbo.' + viewName).return()
)
.then(() => knex.schema.raw('DROP VIEW IF EXISTS archive_view').return())
.finally(() => knex.destroy())
