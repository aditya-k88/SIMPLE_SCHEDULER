import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminServicesPage from './pages/AdminServicesPage';
import BookingPage from './pages/BookingPage';
import CalendarView from './pages/CalendarView';
import Navbar from './components/Navbar';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Routes>
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="*" element={<Navigate to="/book" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
