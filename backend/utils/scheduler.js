const { addMinutes, isBefore, parseISO } = require('date-fns');

function getAvailableSlots(dateStr, duration, appointments) {
  const date = parseISO(dateStr);
  const day = date.getUTCDay();
  
  // Check if the day is a weekend (Saturday or Sunday)
  if (day === 0 || day === 6) return [];

  const dayStartUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 9, 0, 0));
  const dayEndUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 17, 0, 0));

  const booked = appointments.map(a => ({
    start: parseISO(a.startTime),
    end: parseISO(a.endTime)
  }));

  const slots = [];
  let slot = new Date(dayStartUTC);

  // Generate available slots based on the specified duration
  while (isBefore(addMinutes(slot, duration), dayEndUTC) || +addMinutes(slot, duration) === +dayEndUTC) {
    const slotEnd = addMinutes(slot, duration);
    const conflict = booked.some(b => slot < b.end && slotEnd > b.start);

    slots.push({
      start: slot.toISOString(),
      end: slotEnd.toISOString(),
      available: !conflict
    });

    slot = addMinutes(slot, 15); // Move to the next 15-minute interval
  }

  return slots;
}

function getSmartSlots(dateStr, duration, appointments) {
  // Get available slots from the base function
  const slots = getAvailableSlots(dateStr, duration, appointments);

  // Sort slots by start time
  const sortedSlots = slots.sort((a, b) => parseISO(a.start) - parseISO(b.start));

  // Further optimize by minimizing fragmentation
  const optimizedSlots = optimizeSlots(sortedSlots, duration);
  
  return optimizedSlots;
}

function optimizeSlots(slots, duration) {
  const optimized = [];
  let currentSlot = null;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    // If we already have a current slot, check if it can be extended to reduce fragmentation
    if (currentSlot) {
      const currentEnd = parseISO(currentSlot.end);
      const slotStart = parseISO(slot.start);

      // Check if the current slot and the new slot can be combined (no gap between them)
      if (currentEnd >= slotStart && (slotStart - currentEnd) <= 15) {
        currentSlot.end = slot.end; // Extend the current slot
      } else {
        optimized.push(currentSlot); // Add the previous currentSlot and reset
        currentSlot = slot;
      }
    } else {
      currentSlot = slot;
    }
  }

  if (currentSlot) {
    optimized.push(currentSlot); // Add the last slot
  }

  // Filter out slots smaller than the service duration to avoid fragmentation
  return optimized.filter(slot => {
    const slotDuration = (parseISO(slot.end) - parseISO(slot.start)) / 60000;
    return slotDuration >= duration;
  });
}

module.exports = {
  getAvailableSlots,
  getSmartSlots
};
