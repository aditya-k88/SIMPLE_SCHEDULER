import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Simple Scheduler
        </Typography>
        <Button color="inherit" component={Link} to="/book">
          Book Appointment
        </Button>
        <Button color="inherit" component={Link} to="/calendar">
          Calendar View
        </Button>
        <Button color="inherit" component={Link} to="/admin/services">
          Admin Services
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
