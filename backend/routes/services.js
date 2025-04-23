const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM services', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve services' });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { name, duration, price } = req.body;
  if (!name || !duration || !price) return res.status(400).json({ error: 'Missing required fields' });

  const query = `INSERT INTO services (name, duration, price) VALUES (?, ?, ?)`;
  db.run(query, [name, duration, price], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to create service' });
    res.status(201).json({ id: this.lastID, name, duration, price });
  });
});

module.exports = router;
