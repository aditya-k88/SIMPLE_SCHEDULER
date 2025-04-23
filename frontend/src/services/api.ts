const API_BASE = "/api";

export const getServices = async () => {
  const res = await fetch(`${API_BASE}/services`);
  return res.json();
};

export const createService = async (data: any) => {
  const res = await fetch(`${API_BASE}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAppointments = async () => {
  const res = await fetch(`${API_BASE}/appointments`);
  return res.json();
};

export const createAppointment = async (data: any) => {
  console.log("Creating appointment with data:", data); // Debugging log
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAvailability = async (date: string, serviceId: string) => {
  const res = await fetch(`${API_BASE}/availability?date=${date}&serviceId=${serviceId}`);
  return res.json();
};

// New function to fetch smart slots
export const getSmartSlots = async (date: string, serviceId: string) => {
  const res = await fetch(`${API_BASE}/availability/smart?date=${date}&serviceId=${serviceId}`);
  return res.json();
};


// New function to check slot availability
export const checkSlotAvailability = async (serviceId: string, startTime: string, endTime: string) => {
  const res = await fetch(`${API_BASE}/appointments/check-slot?serviceId=${serviceId}&startTime=${startTime}&endTime=${endTime}`);
  return res.json();
};
