const config = require('./config')
const defaultConnection = {
  host: config.DATABASE_SERVER,
  user: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE,
  options: {
    encrypt: true
  }
}

module.exports = {
  development: {
    client: 'mssql',
    connection: defaultConnection,
    debug: false,
    pool: {
      max: 500
    }
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
    debug: false,
    pool: {
      max: 500
    }
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
    debug: false,
    pool: {
      max: 500
    }
  },
  dev: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.MIGRATION_APP_DATABASE_USERNAME,
      password: config.MIGRATION_APP_DATABASE_PASSWORD,
      options: {
        encrypt: true,
        requestTimeout: 120000
      }
    }),
    seeds: {
      directory: 'seed/data/dev'
    },
    debug: false,
    pool: {
      max: 500
    }
  },
  views: {
    client: 'mssql',
    connection: Object.assign({}, defaultConnection, {
      user: config.MIGRATION_APP_DATABASE_USERNAME,
      password: config.MIGRATION_APP_DATABASE_PASSWORD,
      options: {
        encrypt: true,
        requestTimeout: 120000
      }
    }),
    seeds: {
      directory: 'seed/views'
    },
    debug: false,
    pool: {
      max: 500
    }
  }
}
