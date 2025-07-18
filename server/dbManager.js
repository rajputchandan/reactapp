// server/dbManager.js
const mongoose = require('mongoose');
require('dotenv').config(); // make sure env variables are loaded
const connections = {};

const baseUri = process.env.MONGO_URI;
if (!baseUri) {
  throw new Error('❌ MONGO_URI is not defined in .env');
}
const getDatabase = async (dbName) => {
  try {
    if (connections[dbName]) {
      return connections[dbName];
    }

    const conn = await mongoose.createConnection(baseUri, {
      dbName,                                // ✅ Use separate database name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    conn.on('connected', () => {
      console.log(`✅ Connected to DB: ${dbName}`);
    });

    conn.on('error', (err) => {
      console.error(`❌ DB Error (${dbName}):`, err.message);
    });

    connections[dbName] = conn;
    return conn;
  } catch (error) {
    console.error(`❌ Failed to connect to DB: ${dbName}`, error.message);
    throw error;
  }
};

module.exports = getDatabase;
