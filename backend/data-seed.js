const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Correct path to the database file
const dbPath = path.join(__dirname, 'db', 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create tables if not exist
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price REAL NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serviceId INTEGER NOT NULL,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    FOREIGN KEY (serviceId) REFERENCES services(id)
  )`);

  // Delete existing data to avoid duplication
  db.run(`DELETE FROM appointments`);
  db.run(`DELETE FROM sqlite_sequence WHERE name='appointments'`);

  db.run(`DELETE FROM services`);
  db.run(`DELETE FROM sqlite_sequence WHERE name='services'`);

  // Prepare and insert services
  const insertService = db.prepare(`
    INSERT INTO services (name, duration, price) VALUES (?, ?, ?)
  `);

  const services = [
    ["Haircut", 30, 35.00],
    ["Consultation", 60, 100.00],
    ["Massage", 45, 65.00],
    ["Quick Repair", 20, 40.00]
  ];

  services.forEach(([name, duration, price]) => {
    insertService.run(name, duration, price);
  });

  insertService.finalize();

  // Prepare and insert appointments
  const insertAppointment = db.prepare(`
    INSERT INTO appointments (serviceId, customerName, customerEmail, startTime, endTime)
    VALUES (?, ?, ?, ?, ?)
  `);

  const appointments = [
    [1, "John Smith", "john@example.com", "2025-04-10T10:00:00.000Z", "2025-04-10T10:30:00.000Z"],
    [3, "Alice Johnson", "alice@example.com", "2025-04-10T14:00:00.000Z", "2025-04-10T14:45:00.000Z"],
    [2, "Robert Brown", "robert@example.com", "2025-04-11T09:00:00.000Z", "2025-04-11T10:00:00.000Z"]
  ];

  appointments.forEach(([serviceId, name, email, start, end]) => {
    insertAppointment.run(serviceId, name, email, start, end);
  });

  insertAppointment.finalize();
});

db.close();
