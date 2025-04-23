const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { OutputSharp } = require('@mui/icons-material');


// Get all appointments
router.get('/', (req, res) => {
  db.all('SELECT * FROM appointments', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve appointments' });
    res.json(rows);
  });
});

// Check slot availability before booking
router.get('/check-slot', (req, res) => {
  const { serviceId, startTime, endTime } = req.query;

  if (!serviceId || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  // Convert the startTime and endTime to Date objects
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Conflict check — scoped to same serviceId
  db.get(
    `SELECT * FROM appointments
     WHERE serviceId = ? 
     AND (? < endTime AND ? > startTime)`,
    [serviceId, startTime, endTime],
    (err, conflict) => {
      if (err) return res.status(500).json({ error: 'Error checking conflicts' });
      
      if (conflict) {
        // If there is a conflict, return 200 OK with available: false
        return res.status(200).json({ available: false });
      }
      
      // If no conflict, the slot is available
      res.status(200).json({ available: true });
    }
  );
});


// Create a new appointment
router.post('/', (req, res) => {
  const { serviceId, customerName, customerEmail, startTime, endTime } = req.body;
  console.log(req.body);
  if (!serviceId || !customerName || !customerEmail || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Convert strings to Date objects (UTC)
  const start = new Date(startTime);
  const end = new Date(endTime);
  const dayOfWeek = start.getUTCDay(); // 0 = Sunday, 6 = Saturday

  // Check if it's Monday–Friday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return res.status(400).json({ error: 'Bookings are only allowed Monday to Friday.' });
  }

  // Check time boundaries: 09:00 to 17:00 UTC
  const startHour = start.getUTCHours();
  const endHour = end.getUTCHours();
  const startMinute = start.getUTCMinutes();
  const endMinute = end.getUTCMinutes();
  if (
    startHour < 9 ||
    endHour > 17 ||
    (endHour === 17 && endMinute > 0) ||
    start >= end
  ) {
    return res.status(400).json({ error: 'Booking must be within working hours (9 AM to 5 PM UTC).' });
  }

  // Conflict check — scoped to same serviceId
  db.get(
    `SELECT * FROM appointments
     WHERE serviceId = ? 
     AND (? < endTime AND ? > startTime)`,
    [serviceId, startTime, endTime],
    (err, conflict) => {
      if (err) return res.status(500).json({ error: 'Error checking conflicts' });
      if (conflict) return res.status(409).json({ error: 'Time slot is already booked for this service.' });

      // Insert new appointment if no conflict
      const query = `INSERT INTO appointments (serviceId, customerName, customerEmail, startTime, endTime)
                     VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [serviceId, customerName, customerEmail, startTime, endTime], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to create appointment' });
        res.status(201).json({ id: this.lastID });
      });
    }
  );
});

module.exports = router;
