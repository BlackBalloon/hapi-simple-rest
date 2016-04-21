module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'hapi_rest',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'hapi_rest',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
