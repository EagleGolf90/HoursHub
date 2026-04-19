# Business Hours Checker - Feature Documentation

## Overview

The Business Hours Checker is a comprehensive system for managing and displaying company business hours. It includes real-time status checking, holiday exception handling, and multi-location support.

## Features

### 1. **Real-Time Status Display**
- Shows whether the business is currently open or closed
- Displays current time with live updates every minute
- Shows next status change (closing time or next opening time)
- Color-coded status indicators (green for open, red for closed)

### 2. **Holiday Exception Handling**
- Checks if a date is a holiday and whether the business is closed
- Skips holidays when calculating next opening time
- Displays holiday information with closure status

### 3. **Multi-Location Support**
- Switch between different business locations
- Each location can have different hours and holidays
- Location selector with active location highlighting

### 4. **Multiple Time Slots**
- Support for split shifts (e.g., morning 9-12, afternoon 1-5 PM)
- Display break times between shifts
- Organized by day of week

### 5. **Regular Hours Display**
- Weekly schedule table
- Current day highlighted
- Easy-to-read 12-hour AM/PM format

## Components

### BusinessHours.jsx
Main React component that displays business hours information.

**Props:**
- `locationId` (number): ID of the location to display (default: 1)
- `businessName` (string): Name of the business (default: 'Our Business')
- `hours` (object): Custom business hours object (optional)
- `showTimeSlots` (boolean): Show multiple time slots (default: true)
- `showHolidays` (boolean): Show holiday exceptions (default: true)

**Features:**
- Fetches and manages location data
- Real-time status updates
- Location switching
- Comprehensive hours display

### businessHoursChecker.js Utility Functions

#### Time Conversion Functions
- `timeToMinutes(time)`: Convert time string (HH:MM) or number to minutes since midnight
- `minutesToTime(minutes)`: Convert minutes to HH:MM format
- `formatTime(time)`: Format time to 12-hour AM/PM format

#### Business Status Functions
- `getHolidayOnDate(date, holidays)`: Check if a date is a holiday
- `isBusinessOpen(dateTime, businessHours, holidays)`: Check if business is open at a specific time
- `getNextOpeningTime(dateTime, businessHours, holidays)`: Get the next opening time
- `getBusinessStatus(dateTime, businessHours, holidays)`: Get comprehensive status object
- `formatHours(hoursObject)`: Format hours object for display
- `getWeekSchedule(businessHours)`: Get formatted weekly schedule

## Data Structure

### Business Hours Object
```javascript
{
  Monday: { open: 9, close: 18 },      // 9 AM - 6 PM
  Tuesday: { open: 9, close: 18 },
  Wednesday: { open: 9, close: 18 },
  Thursday: { open: 9, close: 18 },
  Friday: { open: 9, close: 20 },      // 9 AM - 8 PM
  Saturday: { open: 10, close: 16 },   // 10 AM - 4 PM
  Sunday: { open: null, close: null }  // Closed
}
```

### Location Object
```javascript
{
  id: 1,
  name: 'Main Office',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  regularHours: [
    { day: 'Monday', open: '09:00', close: '18:00' },
    // ... more days
  ],
  timeSlots: [
    { 
      day: 'Monday', 
      slots: [
        { open: '09:00', close: '12:00' },
        { open: '13:00', close: '18:00', breakStart: '12:00', breakEnd: '13:00' }
      ]
    }
  ],
  holidays: [
    { date: '2025-12-25', name: 'Christmas Day', closed: true },
    // ... more holidays
  ]
}
```

## Usage Examples

### Basic Usage
```jsx
import BusinessHours from './components/BusinessHours';

function App() {
  return <BusinessHours businessName="My Company" />;
}
```

### With Custom Hours
```jsx
const customHours = {
  Monday: { open: 8, close: 17 },
  // ... other days
};

<BusinessHours 
  locationId={2} 
  hours={customHours}
  showTimeSlots={true}
  showHolidays={true}
/>
```

### Using Utility Functions
```jsx
import { 
  isBusinessOpen, 
  getNextOpeningTime, 
  formatTime 
} from '../utils/businessHoursChecker';

const now = new Date();
const isOpen = isBusinessOpen(now, businessHours, holidays);
const nextOpening = getNextOpeningTime(now, businessHours, holidays);
```

## Database Integration

The component currently uses sample data. To integrate with a database:

1. Replace the `sampleData` in BusinessHours.jsx with API calls
2. Example API endpoint: `GET /api/locations/:locationId`
3. The data structure should match the Location Object format above

### Example API Integration
```jsx
useEffect(() => {
  setLoading(true);
  try {
    const response = await fetch(`/api/locations/${locationId}`);
    const location = await response.json();
    setSelectedLocation(location);
  } catch (err) {
    setError('Failed to load business hours');
  } finally {
    setLoading(false);
  }
}, [locationId]);
```

## Time Format Support

The system supports multiple time format inputs:
- **String format**: "09:00", "18:30", "20:45"
- **Number format**: 9, 18, 20 (represents hours)
- **Output format**: "9:00 AM", "6:00 PM", "8:45 PM"

## Styling

Hours are displayed with CSS classes for customization:
- `.status-card`: Main status display container
- `.status-light`: Visual indicator (open/closed)
- `.hours-table`: Weekly schedule table
- `.time-slots`: Multiple time slots section
- `.holidays`: Holiday exceptions section
- `.today`: Highlighted current day

See [BusinessHours.css](../styles/BusinessHours.css) for styling details.

## Error Handling

- Loading state while fetching data
- Error messages for failed data retrieval
- Graceful fallback to default hours
- Validation of time values

## Performance Considerations

- Status updates every 60 seconds (configurable)
- Efficient date calculations for next opening time
- Memoized utility functions for reusability
- Minimal re-renders with proper React hooks usage

## Future Enhancements

- [ ] API integration with backend database
- [ ] Support for special events/temporary closures
- [ ] Time zone handling for multi-region businesses
- [ ] Add to calendar integration
- [ ] Notifications for upcoming closures
- [ ] Staff scheduling integration
