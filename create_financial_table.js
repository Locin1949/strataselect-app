// create_financial_table.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "strataselect.db");
console.log("Using database:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open database:", err);
    process.exit(1);
  }
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS financial_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  fund TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  receipt_path TEXT
);
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error("Error creating financial_transactions table:", err);
  } else {
    console.log("✔ financial_transactions table created or already exists.");
  }
  db.close();
});
