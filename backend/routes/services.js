// Importing necessary modules
const express = require('express');
const router = express.Router();
const db = require('../db/database');  // Importing the database connection

// GET route to fetch all services
router.get('/', (req, res) => {
  // Query the database to get all services
  db.all('SELECT * FROM services', (err, rows) => {
    if (err) {
      // If there's an error with the query, send a 500 status with an error message
      return res.status(500).json({ error: 'Failed to retrieve services' });
    }
    // Return the fetched services as JSON
    res.json(rows);
  });
});

// POST route to create a new service
router.post('/', (req, res) => {
  // Destructure the name, duration, and price from the request body
  const { name, duration, price } = req.body;
  
  // Check if all required fields are provided
  if (!name || !duration || !price) {
    // If any field is missing, send a 400 status with an error message
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SQL query to insert a new service into the database
  const query = `INSERT INTO services (name, duration, price) VALUES (?, ?, ?)`;
  
  // Run the query to insert the new service
  db.run(query, [name, duration, price], function (err) {
    if (err) {
      // If there's an error with the insertion, send a 500 status with an error message
      return res.status(500).json({ error: 'Failed to create service' });
    }
    // On success, send the created service's details along with the generated ID
    res.status(201).json({ id: this.lastID, name, duration, price });
  });
});

// Export the router so it can be used in other parts of the application
module.exports = router;
