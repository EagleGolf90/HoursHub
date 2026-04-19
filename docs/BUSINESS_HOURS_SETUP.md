# Business Hours Table Setup Guide

## Overview
This project includes a complete business hours management system with MySQL database schema and React components to display business hours with the following features:
- Day-of-week regular hours
- Multiple time slots per day (e.g., morning and afternoon shifts)
- Holiday exceptions
- Multiple location support
- Real-time open/closed status indicator

## Database Schema

### Tables Created:

#### 1. **Locations Table**
Stores information about different business locations/branches.

```sql
CREATE TABLE Locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. **RegularHours Table**
Stores standard business hours for each day of the week per location.

```sql
CREATE TABLE RegularHours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_location_day (location_id, day_of_week)
);
```

#### 3. **TimeSlots Table**
Stores multiple time slots per day (useful for split shifts, lunch breaks, etc.).

```sql
CREATE TABLE TimeSlots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  slot_number INT DEFAULT 1,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE
);
```

#### 4. **HolidayExceptions Table**
Stores special hours or closures for holidays and special dates.

```sql
CREATE TABLE HolidayExceptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  holiday_date DATE NOT NULL,
  holiday_name VARCHAR(100),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  notes VARCHAR(255),
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_location_date (location_id, holiday_date)
);
```

## Setup Instructions

### 1. Create the Database Tables

Run the SQL commands from `database_schema.sql`:

```bash
mysql -u your_username -p your_database < database_schema.sql
```

Or copy and paste the SQL into your MySQL client.

### 2. Sample Data

The schema file includes sample data for:
- 2 locations (Main Office & Downtown Branch)
- Regular hours for each location
- Multiple time slots for specific days
- Holiday exceptions

## React Component Usage

### Basic Usage

```jsx
import BusinessHours from './components/BusinessHours';

function App() {
  return <BusinessHours />;
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locationId` | number | 1 | The location ID to display hours for |
| `businessName` | string | 'Our Business' | Business name (optional) |
| `showTimeSlots` | boolean | true | Display multiple time slots section |
| `showHolidays` | boolean | true | Display holiday exceptions section |
| `hours` | object | defaultHours | Custom hours object (for testing) |

### Example with Custom Props

```jsx
<BusinessHours 
  locationId={2} 
  businessName="Downtown Branch"
  showTimeSlots={true}
  showHolidays={true}
/>
```

## Features

### 1. **Status Card**
- Real-time indicator showing if business is open/closed
- Current time display
- Next status change message
- Color-coded (green for open, red for closed)

### 2. **Location Selector**
- Switch between multiple locations
- Shows when more than one location is available

### 3. **Regular Hours Table**
- Display week-by-week hours
- Highlight current day
- Shows "Closed" for days with no hours

### 4. **Multiple Time Slots**
- Display split shifts or multiple opening periods per day
- Show break times if applicable
- Only visible when data is available

### 5. **Holiday Exceptions**
- Display special hours for holidays
- Show closed/open status with color-coded badges
- Useful for Christmas, New Year's, etc.

## Connecting to Your Database

To connect the React component to your actual MySQL database, uncomment and modify the fetch call in the BusinessHours.jsx component:

```jsx
useEffect(() => {
  const fetchBusinessData = async () => {
    try {
      const response = await fetch(`/api/locations/${locationId}/hours`);
      const data = await response.json();
      setSelectedLocation(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching business data:', err);
      setLoading(false);
    }
  };
  fetchBusinessData();
}, [locationId]);
```

Create a corresponding API endpoint on your backend that:
1. Queries the database based on `locationId`
2. Returns location info, regular hours, time slots, and holidays
3. Formats the data according to the structure in the component

## File Locations

- **Database Schema**: `/database_schema.sql`
- **React Component**: `/src/components/BusinessHours.jsx`
- **Styling**: `/src/styles/BusinessHours.css`

## Styling

The component uses modern CSS with:
- Gradient backgrounds
- Smooth transitions
- Responsive design for mobile and desktop
- Color-coded status indicators
- Accessible contrast ratios

## Notes

- The component currently uses sample data. Replace with actual API calls when ready
- Holiday exceptions override regular hours
- Time slots are useful for displaying split shifts, lunch breaks, or multiple service periods
- All times use 24-hour format in the database
- Display format is 24-hour (HH:MM)
