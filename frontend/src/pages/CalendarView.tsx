import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { getAppointments, getServices, getAvailability } from "../services/api";

dayjs.extend(utc);
dayjs.extend(timezone);

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthViewDate, setMonthViewDate] = useState(dayjs().utc());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [apps, servs] = await Promise.all([
        getAppointments(),
        getServices(),
      ]);
      setAppointments(apps);
      setServices(servs);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDateChange = async (newDate: Dayjs | null) => {
    if (!newDate) return;

    // Treat clicked date as UTC date
    const utcDate = dayjs.utc(newDate.format("YYYY-MM-DD"));
    setSelectedDate(utcDate);

    try {
      const formattedDate = utcDate.format("YYYY-MM-DD");

      // Fetch availability for all services
      const allServicesBookedSlots = await Promise.all(
        services.map(async (service) => {
          // Get all booked slots for a particular service on the selected date
          const serviceBookedSlots = appointments.filter((a) =>
            dayjs.utc(a.startTime).format("YYYY-MM-DD") === formattedDate && a.serviceId === service.id
          );
          return { service, bookedSlots: serviceBookedSlots };
        })
      );

      // Flatten the booked slots for all services
      const flattenedBookedSlots = allServicesBookedSlots.flatMap((item) =>
        item.bookedSlots.map((slot) => ({
          ...slot,
          serviceName: item.service.name,
        }))
      );

      setBookedSlots(flattenedBookedSlots);
    } catch (err) {
      console.error("Error fetching availability", err);
    }
  };

  const getDayStatus = (date: Dayjs) => {
    const dateStr = dayjs.utc(date.format("YYYY-MM-DD")).format("YYYY-MM-DD");

    // Check if any appointment exists for the selected date
    const dayAppointments = appointments.filter((a) =>
      dayjs.utc(a.startTime).format("YYYY-MM-DD") === dateStr
    );

    if (dayAppointments.length > 0) return "booked";  // Show as booked if there are bookings
    return "free";  // If no bookings, the day is free
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case "booked":
        return "#FFCDD2";  // red for booked
      default:
        return "white";
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Monthly Calendar
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={monthViewDate}
            onChange={(newDate) => {
              setMonthViewDate(newDate!);
              handleDateChange(newDate);
            }}
            renderDay={(day, _value, pickersDayProps) => {
              const status = getDayStatus(day);
              const backgroundColor = getDayColor(status);

              return (
                <PickersDay
                  {...pickersDayProps}
                  sx={{
                    backgroundColor,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#B3E5FC",
                    },
                  }}
                />
              );
            }}
          />

          {selectedDate && (
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Booked Slots for {selectedDate.format("dddd, MMMM D, YYYY")} (UTC)
              </Typography>
              {bookedSlots.length === 0 ? (
                <Typography>No bookings for this date.</Typography>
              ) : (
                <Grid container spacing={1}>
                  {bookedSlots.map((slot, i) => {
                    const time = dayjs.utc(slot.startTime || slot.start)
                      .format("YYYY-MM-DD HH:mm") // Formatting both date and time in UTC
                    return (
                      <Grid item key={i}>
                        <Chip
                          label={`${time} - ${slot.serviceName}`}
                          color="error" // Red color for booked slots
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Paper>
          )}
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default CalendarView;
