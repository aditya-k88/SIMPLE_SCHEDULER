
# SimpleScheduler

SimpleScheduler is an appointment booking system where users can book appointments based on available time slots for different services. The system supports smart scheduling, which helps suggest optimal time slots based on predefined criteria.

## Features

- **Service-based Appointment Booking**: Allows users to select a service and book an appointment.
- **Smart Scheduling**: Automatically filters and displays optimal time slots based on predefined logic (e.g., filtering slots to show less crowded times).
- **Slot Availability Checking**: Checks if a selected time slot is already booked and prevents double booking.
- **Responsive UI**: Built with React and Material-UI for a smooth and user-friendly experience.

## Local Setup

Follow these steps to set up the project locally:

### Prerequisites

- **Node.js**: Install Node.js from [here](https://nodejs.org/).
- **Git**: Ensure you have Git installed. If not, download it from [here](https://git-scm.com/).

### 1. Clone the Repository

```bash
git clone https://github.com/aditya-k88/SIMPLE_SCHEDULER.git
```

### 2. Install Dependencies

Navigate to the project folder:

```bash
cd SIMPLE_SCHEDULER
```

#### For Backend:

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install the backend dependencies using npm:

   ```bash
   npm install
   ```

#### For Frontend:

1. Navigate to the `frontend` folder:

   ```bash
   cd ../frontend
   ```

2. Install the frontend dependencies using npm:

   ```bash
   npm install
   ```

### 3. Seed Data for the Backend

If you need to seed initial data (e.g., services), follow these steps:

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. If you're using SQLite, run the seeding script:

   ```bash
   npm run data-seed.js
   ```

   This will populate the database with necessary initial data (like services, sample slots, etc.).

### 4. Start the Server : run the below command
   ```bash
   npm run dev
   ```

   This will start the React development server, typically accessible on `http://localhost:3000`.

### 5. Open the Application

Once both the backend and frontend servers are running, you can open the application by navigating to `http://localhost:5173/` in your browser.

Now you should be able to interact with the SimpleScheduler application locally.

## Smart Scheduling

### What is Smart Scheduling?

Smart Scheduling automatically filters available time slots to help users find optimal appointment times based on predefined logic. For example, it might show morning slots (from 9 AM to 12 PM) to avoid crowded afternoon hours.

### How it works

1. **Fetching Smart Slots**: The system fetches the available time slots from the backend for a given service and date.
2. **Applying Filters**: The fetched slots are filtered based on custom criteria. For instance, the system might:
   - Only show slots in the morning (e.g., between 9 AM and 12 PM).
   - Exclude slots that are already booked.
3. **Display Smart Slots**: After applying the filter, the system displays the filtered slots to the user for easy selection.

### How to Use Smart Scheduling

- When booking an appointment, click the **"Show Smart Slots"** button after selecting a service and date.
- The application will automatically filter and display the most optimal available time slots, allowing you to easily pick a time that fits your schedule.

## Directory Structure

```
/simple_scheduler
  /backend                # Backend API and database logic
  /frontend               # React app for the UI
  /node_modules           # Project dependencies
  /public                 # Public assets (images, etc.)
  /src                    # Frontend source code
  .gitignore              # Git ignore file
  README.md               # This file
```
