const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { getAvailableSlots, getSmartSlots } = require('../utils/scheduler');

router.get('/', (req, res) => {
  const { date, serviceId } = req.query;
  console.log(`Fetching availability for date: ${date}, serviceId: ${serviceId}`);
  if (!date || !serviceId) return res.status(400).json({ error: 'Missing date or serviceId' });

  db.get(`SELECT duration FROM services WHERE id = ?`, [serviceId], (err, service) => {
    if (err || !service) return res.status(400).json({ error: 'Invalid service ID' });

    db.all(
      `SELECT startTime, endTime FROM appointments
       WHERE serviceId = ? AND date(startTime) = date(?)`,
      [serviceId, date],
      (err, appointments) => {
        if (err) return res.status(500).json({ error: 'Failed to get appointments' });

        const slots = getAvailableSlots(date, service.duration, appointments);
        res.json(slots);
      }
    );
  });
});

router.get('/smart', (req, res) => {
  const { date, serviceId } = req.query;
  if (!date || !serviceId) return res.status(400).json({ error: 'Missing date or serviceId' });

  db.get(`SELECT duration FROM services WHERE id = ?`, [serviceId], (err, service) => {
    if (err || !service) return res.status(400).json({ error: 'Invalid service ID' });

    db.all(
      `SELECT startTime, endTime FROM appointments
       WHERE serviceId = ? AND date(startTime) = date(?)`,
      [serviceId, date],
      (err, appointments) => {
        if (err) return res.status(500).json({ error: 'Failed to get appointments' });

        const smartSlots = getSmartSlots(date, service.duration, appointments);
        res.json(smartSlots);
      }
    );
  });
});

module.exports = router;
