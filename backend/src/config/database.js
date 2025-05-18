const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';

// Create the database connection
const db = knex(config[environment]);

// Test the connection
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit if we can't connect to the database
  });

// Add error handling for lost connections
db.on('error', (err) => {
  console.error('Unexpected database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

module.exports = db; 