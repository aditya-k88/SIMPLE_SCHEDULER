import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, CircularProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getServices, createService } from '../services/api'; // Import the API functions

const AdminServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [serviceDuration, setServiceDuration] = useState(0);
  const [servicePrice, setServicePrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Add a new service
  const handleAddService = async () => {
    if (!serviceName || serviceDuration <= 0 || servicePrice <= 0) return;

    setIsAdding(true);
    try {
      const newService = await createService({
        name: serviceName,
        duration: serviceDuration,
        price: servicePrice,
      });
      setServices((prevServices) => [...prevServices, newService]);
      setServiceName('');
      setServiceDuration(0);
      setServicePrice(0);
    } catch (error) {
      console.error('Error adding service:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Services
      </Typography>
      
      <Grid container spacing={2} direction="column" maxWidth="500px" margin="0 auto">
        <Grid item>
          <TextField
            label="Service Name"
            variant="outlined"
            fullWidth
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Duration (Minutes)"
            type="number"
            variant="outlined"
            fullWidth
            value={serviceDuration}
            onChange={(e) => setServiceDuration(Number(e.target.value))}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Price ($)"
            type="number"
            variant="outlined"
            fullWidth
            value={servicePrice}
            onChange={(e) => setServicePrice(Number(e.target.value))}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddService}
            disabled={isAdding}
            fullWidth
          >
            {isAdding ? <CircularProgress size={24} /> : 'Add Service'}
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom marginTop={4}>
        Available Services
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {services.map((service) => (
            <ListItem key={service.id} divider>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body1">{service.name}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{service.duration} mins</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">${service.price}</Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default AdminServicesPage;
