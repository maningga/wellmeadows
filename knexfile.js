require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.REACT_APP_DB_HOST || 'localhost',
      port: process.env.REACT_APP_DB_PORT || 5432,
      database: process.env.REACT_APP_DB_NAME || 'wellmeadows',
      user: process.env.REACT_APP_DB_USER,
      password: process.env.REACT_APP_DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.REACT_APP_DB_HOST,
      port: process.env.REACT_APP_DB_PORT,
      database: process.env.REACT_APP_DB_NAME,
      user: process.env.REACT_APP_DB_USER,
      password: process.env.REACT_APP_DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
  },
}; 