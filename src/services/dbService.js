const mongoose = require('mongoose');
require('dotenv').config();
require('../model');

const mongoCredential = ({
  host: process.env.DB_HOST,
  database: process.env.DB_BASE,
  port: process.env.DB_PORT,
});

// Set up default mongoose connection
const url = `mongodb://${mongoCredential.host}:${mongoCredential.port}/${mongoCredential.database}`;

const connect = () => {
  console.log(url);
  mongoose.connect(url);

  mongoose.Promise = global.Promise;

  const db = mongoose.connection;

  db.on('connected', () => {
    console.log('Db connected');
  });
  db.on('error', (err) => {
    console.error('Db not connected', err.message);
  });
};

module.exports = { connect };
