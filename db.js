// db.js
const Database = require('better-sqlite3');
const path = require('path');

// IMPORTANT: This must match your actual database file
const dbPath = path.join(__dirname, 'strataselect.db');

// Open the database
const db = new Database(dbPath, {
  verbose: console.log
});

module.exports = db;
