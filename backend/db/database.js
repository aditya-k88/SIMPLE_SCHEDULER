const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');

// Check if the database file exists
fs.access(dbPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("Database file does not exist or cannot be accessed:", dbPath);
  } else {
    console.log("Database file exists and is accessible.");
  }
});

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database opened successfully.");
  }
});



db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration INTEGER NOT NULL,
      price REAL NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serviceId INTEGER NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      FOREIGN KEY (serviceId) REFERENCES services(id)
    )
  `);
});

module.exports = db;
