// Import required modules
const fs = require('fs'); // For file system operations like checking if the database file exists
const path = require('path'); // For handling and manipulating file paths
const sqlite3 = require('sqlite3').verbose(); // For working with SQLite databases

// Define the path to the database file
const dbPath = path.join(__dirname, 'database.db');

// Check if the database file exists
fs.access(dbPath, fs.constants.F_OK, (err) => {
  if (err) {
    // If the database file does not exist or cannot be accessed, log an error message
    console.error("Database file does not exist or cannot be accessed:", dbPath);
  } else {
    // If the database file exists and is accessible, log a success message
    console.log("Database file exists and is accessible.");
  }
});

// Open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // If there's an error opening the database, log the error message
    console.error("Error opening database:", err.message);
  } else {
    // If the database is opened successfully, log a success message
    console.log("Database opened successfully.");
  }
});

// Initialize the database by creating tables if they do not exist
db.serialize(() => {
  // Create the 'services' table if it doesn't exist, with columns for id, name, duration, and price
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT, // Auto-incrementing primary key
      name TEXT NOT NULL, // Name of the service, cannot be null
      duration INTEGER NOT NULL, // Duration of the service in minutes, cannot be null
      price REAL NOT NULL // Price of the service, cannot be null
    )
  `);

  // Create the 'appointments' table if it doesn't exist, with columns for id, serviceId, customerName, customerEmail, startTime, and endTime
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, // Auto-incrementing primary key
      serviceId INTEGER NOT NULL, // Foreign key referencing the 'services' table
      customerName TEXT NOT NULL, // Customer's name, cannot be null
      customerEmail TEXT NOT NULL, // Customer's email, cannot be null
      startTime TEXT NOT NULL, // Start time of the appointment, cannot be null
      endTime TEXT NOT NULL, // End time of the appointment, cannot be null
      FOREIGN KEY (serviceId) REFERENCES services(id) // Reference to the 'services' table's id column
    )
  `);
});

// Export the 'db' object to be used in other files
module.exports = db;
