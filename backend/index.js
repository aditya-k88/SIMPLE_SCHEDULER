const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const availabilityRoutes = require('./routes/availability');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 