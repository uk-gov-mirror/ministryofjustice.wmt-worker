const config = require('./config')
const defaultConnection = {
  host: config.DATABASE_SERVER,
  user: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE,
  options: {
    encrypt: true,
    requestTimeout: 60000
  }
}

module.exports = {
  development: {
    client: 'mssql',
    connection: defaultConnection,
    debug: false
  },
  staging: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.MIGRATION_STG_DATABASE_USERNAME,
      password: config.MIGRATION_STG_DATABASE_PASSWORD
    }),
    migrations: {
      directory: 'migrations/staging'
    },
    debug: false
  },
  app: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.MIGRATION_APP_DATABASE_USERNAME,
      password: config.MIGRATION_APP_DATABASE_PASSWORD,
      options: {
        encrypt: true,
        requestTimeout: 120000
      }
    }),
    migrations: {
      directory: 'migrations/app'
    },
    seeds: {
      directory: 'seed/data/ref'
    },
    debug: false
  },
  dev: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.MIGRATION_APP_DATABASE_USERNAME,
      password: config.MIGRATION_APP_DATABASE_PASSWORD,
      options: {
        encrypt: true,
        requestTimeout: 60000
      }
    }),
    seeds: {
      directory: 'seed/data/dev'
    },
    debug: false
  },
  archive: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.ARCHIVE_DATABASE_USERNAME,
      password: config.ARCHIVE_DATABASE_PASSWORD,
      database: config.ARCHIVE_DATABASE,
      options: {
        encrypt: true,
        requestTimeout: 600000
      }
    }),
    seeds: {
      directory: 'seed/archive-views'
    },
    debug: true
  },
  views: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.MIGRATION_APP_DATABASE_USERNAME,
      password: config.MIGRATION_APP_DATABASE_PASSWORD,
      options: {
        encrypt: true,
        requestTimeout: 60000
      }
    }),
    seeds: {
      directory: 'seed/views'
    },
    debug: false
  }
}
