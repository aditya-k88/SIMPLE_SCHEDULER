// Import necessary dependencies
const express = require('express');
const router = express.Router();  // Create an Express router to handle routing
const db = require('../db/database');  // Import database module for querying
const { getAvailableSlots, getSmartSlots } = require('../utils/scheduler');  // Import utility functions to calculate available and smart slots

// Route to fetch available slots for a specific service on a specific date
router.get('/', (req, res) => {
  const { date, serviceId } = req.query;  // Extract 'date' and 'serviceId' from query parameters
  console.log(`Fetching availability for date: ${date}, serviceId: ${serviceId}`);
  
  // If 'date' or 'serviceId' is missing, return a 400 error
  if (!date || !serviceId) return res.status(400).json({ error: 'Missing date or serviceId' });

  // Query the database to get the service duration using the service ID
  db.get(`SELECT duration FROM services WHERE id = ?`, [serviceId], (err, service) => {
    // If there's an error or the service doesn't exist, return a 400 error
    if (err || !service) return res.status(400).json({ error: 'Invalid service ID' });

    // Query the database to get all appointments for the given service on the given date
    db.all(
      `SELECT startTime, endTime FROM appointments
       WHERE serviceId = ? AND date(startTime) = date(?)`,
      [serviceId, date],
      (err, appointments) => {
        // If there's an error retrieving the appointments, return a 500 error
        if (err) return res.status(500).json({ error: 'Failed to get appointments' });

        // Use the getAvailableSlots function to calculate the available slots
        const slots = getAvailableSlots(date, service.duration, appointments);
        res.json(slots);  // Send the available slots in the response
      }
    );
  });
});

// Route to fetch "smart" available slots (possibly considering other factors beyond simple availability)
router.get('/smart', (req, res) => {
  const { date, serviceId } = req.query;  // Extract 'date' and 'serviceId' from query parameters
  // If 'date' or 'serviceId' is missing, return a 400 error
  if (!date || !serviceId) return res.status(400).json({ error: 'Missing date or serviceId' });

  // Query the database to get the service duration using the service ID
  db.get(`SELECT duration FROM services WHERE id = ?`, [serviceId], (err, service) => {
    // If there's an error or the service doesn't exist, return a 400 error
    if (err || !service) return res.status(400).json({ error: 'Invalid service ID' });

    // Query the database to get all appointments for the given service on the given date
    db.all(
      `SELECT startTime, endTime FROM appointments
       WHERE serviceId = ? AND date(startTime) = date(?)`,
      [serviceId, date],
      (err, appointments) => {
        // If there's an error retrieving the appointments, return a 500 error
        if (err) return res.status(500).json({ error: 'Failed to get appointments' });

        // Use the getSmartSlots function to calculate the "smart" available slots
        const smartSlots = getSmartSlots(date, service.duration, appointments);
        res.json(smartSlots);  // Send the smart slots in the response
      }
    );
  });
});

// Export the router to be used in the main app
module.exports = router;
