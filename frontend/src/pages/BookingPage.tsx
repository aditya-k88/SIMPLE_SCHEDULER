import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  getServices,
  getAvailability,
  createAppointment,
  checkSlotAvailability,
  getSmartSlots, // Import the new API function
} from "../services/api";

const BookingPage = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [smartSlots, setSmartSlots] = useState([]); // State for smart slots
  const [form, setForm] = useState({ name: "", email: "", slot: "" });
  const [message, setMessage] = useState("");
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [slotAvailability, setSlotAvailability] = useState({});

  // Fetch available services
  useEffect(() => {
    setLoadingServices(true);
    getServices()
      .then((data) => {
        console.log("Fetched Services:", data);  // Debugging log
        setServices(data);
      })
      .catch(() => setError("Failed to load services."))
      .finally(() => setLoadingServices(false));
  }, []);

  // Fetch available time slots for the selected service and date
  const fetchSlots = async () => {
    if (!date || !selectedServiceId) return;
    setLoadingSlots(true);
    try {
      const data = await getAvailability(date, selectedServiceId);
      console.log("Fetched Slots:", data);  // Debugging log
      setSlots(data);
      setError("");
      setSlotAvailability({});
    } catch {
      setError("Failed to fetch availability.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch "Smart Slots" from the API
  const fetchSmartSlots = async () => {
    if (!date || !selectedServiceId) return;
    try {
      const data = await getSmartSlots(date, selectedServiceId);
      console.log("Fetched Smart Slots:", data);  // Debugging log
      setSmartSlots(data);
      setError("");
    } catch {
      setError("Failed to fetch smart slots.");
    }
  };

  // Handle the slot selection
  const handleSlotSelect = async (slot) => {
    console.log("Slot Selected:", slot);  // Debugging log
    setForm({ ...form, slot });

    const service = services.find((s) => s.id === +selectedServiceId);
    const startTime = new Date(slot).toISOString();
    const endTime = new Date(new Date(slot).getTime() + service.duration * 60000).toISOString();

    try {
      const response = await checkSlotAvailability(selectedServiceId, startTime, endTime);
      const isAvailable = response.available; // Check the availability

      if (isAvailable) {
        setSlotAvailability({ [slot]: true });
      } else {
        setSlotAvailability({ [slot]: false });
      }
    } catch (error) {
      setError("Error checking slot availability.");
    }
  };

  // Book the appointment
  const book = async () => {
    const { name, email, slot } = form;
    if (!name || !email || !slot || !selectedServiceId) {
      setError("Please fill all required fields.");
      return;
    }

    const service = services.find((s) => s.id === +selectedServiceId);
    const startTime = new Date(slot).toISOString();
    const endTime = new Date(new Date(slot).getTime() + service.duration * 60000).toISOString();

    try {
      const response = await checkSlotAvailability(selectedServiceId, startTime, endTime);
      if (!response.available) {
        setError("This time slot is already booked.");
        return;
      }

      setBooking(true);
      const payload = {
        serviceId: +selectedServiceId,
        customerName: name,
        customerEmail: email,
        startTime,
        endTime,
      };

      await createAppointment(payload);

      setMessage("Appointment booked successfully!");
      setError("");
      setForm({ name: "", email: "", slot: "" });
      setSlots([]);
    } catch (err) {
      setError("Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <Box maxWidth="700px" mx="auto" mt={4} px={2}>
      <Typography variant="h4" gutterBottom>
        Book an Appointment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Service Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="service-label">Select Service</InputLabel>
            <Select
              labelId="service-label"
              id="service-select"
              value={selectedServiceId}
              label="Select Service"
              onChange={(e) => setSelectedServiceId(e.target.value)}
              disabled={loadingServices}
              sx={{ minWidth: 400, height: 56 }}
              MenuProps={{
                PaperProps: {
                  sx: { width: 400 },
                },
              }}
            >
              <MenuItem value="">
                <em>Select a service</em>
              </MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {service.duration} mins | Price: ₹{service.price}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date Selection */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Choose Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Grid>

        {/* Buttons: Check Availability and Show Smart Slots */}
        <Grid item xs={12} container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchSlots}
              disabled={loadingSlots || !date || !selectedServiceId}
            >
              {loadingSlots ? <CircularProgress size={24} /> : "Check Availability"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchSmartSlots} // Call the new function here
              disabled={!date || !selectedServiceId}
            >
              Show Smart Slots
            </Button>
          </Grid>
        </Grid>

        {/* Available Slots */}
        {slots.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Available Time Slots (UTC)
            </Typography>
            <Grid container spacing={1}>
              {slots.map((slot) => {
                const utcTime = new Date(slot.start).toISOString().slice(11, 16);
                const isAvailable = slotAvailability[slot.start];

                return (
                  <Grid item key={slot.start}>
                    <Button
                      variant={form.slot === slot.start ? "contained" : "outlined"}
                      color={isAvailable === false ? "error" : "secondary"}
                      onClick={() => handleSlotSelect(slot.start)}
                      disabled={isAvailable === false}
                    >
                      {utcTime} {isAvailable === false && "(Booked)"}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}

        {/* Smart Slots */}
        {smartSlots.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Smart Time Slots (UTC)
            </Typography>
            <Grid container spacing={1}>
              {smartSlots.map((slot) => {
                const utcTime = new Date(slot.start).toISOString().slice(11, 16);
                return (
                  <Grid item key={slot.start}>
                    <Button
                      variant={form.slot === slot.start ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleSlotSelect(slot.start)}
                    >
                      {utcTime}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}

        {/* Name and Email */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Your Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Your Email"
            fullWidth
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Grid>

        {/* Booking Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={book}
            disabled={booking || !form.slot || slotAvailability[form.slot] === false}
          >
            {booking ? <CircularProgress size={24} /> : "Book Appointment"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingPage;
