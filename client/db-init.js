// db.js
const sqlite3 = require('sqlite3').verbose();

// IMPORTANT: This must match your actual database file
const db = new sqlite3.Database('./strataselect.db', (err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

module.exports = db;