# Business Hours CRUD Pages

This document describes the new CRUD (Create, Read, Update, Delete) functionality added to HoursHub for managing business hours.

## Overview

The Business Hours Management system provides a complete interface for managing multiple business locations and their operating hours. Users can:

- **Create** new locations with address information
- **Read** existing location details and their schedules
- **Update** location info, regular hours, time slots, and holiday exceptions
- **Delete** locations, hours, slots, and holidays

## Components Created

### 1. **BusinessHoursManager** (`BusinessHoursManager.jsx`)
The main management hub that orchestrates the CRUD views.

**Features:**
- Navigation between list, add, edit, and detail views
- Sample data loading (replace with API calls)
- Success/error notifications
- State management for locations

**Props:** None (self-contained)

---

### 2. **LocationList** (`LocationList.jsx`)
Displays all business locations in a responsive grid layout.

**Features:**
- Card-based location display
- Quick statistics (open days, time slots, holidays)
- View, edit, and delete buttons
- Empty state with call-to-action
- Responsive grid that adapts to screen size

**Props:**
- `locations` - Array of location objects
- `onAdd` - Callback for adding new location
- `onView` - Callback to view location details
- `onEdit` - Callback to edit location
- `onDelete` - Callback to delete location

---

### 3. **LocationForm** (`LocationForm.jsx`)
Form for creating and editing location information.

**Fields:**
- Location Name (required)
- Category (required)
- Street Address (required)
- City (required)
- State (required, max 2 chars)
- ZIP Code (required)

**Features:**
- Form validation with error messages
- Real-time error clearing as user types
- Submit/Cancel actions
- Centered layout suitable for both add and edit modes

**Props:**
- `location` - Optional existing location data
- `onSubmit` - Callback with form data
- `onCancel` - Callback to cancel editing
- `title` - Page title ("Add New Location" or "Edit Location")

---

### 4. **LocationDetail** (`LocationDetail.jsx`)
Central hub for managing all aspects of a single location.

**Features:**
- Tabbed interface for different hour types
- Location header with name and address
- Edit location info button
- Delete location button
- Three main tabs: Regular Hours, Time Slots, Holiday Exceptions

**Props:**
- `location` - Complete location object
- `onEdit` - Callback to edit location info
- `onDelete` - Callback to delete location
- `onBack` - Callback to return to list
- `onLocationUpdate` - Callback when hours/slots/holidays are updated

---

### 5. **RegularHoursEditor** (`RegularHoursEditor.jsx`)
Manages regular business hours for each day of the week.

**Features:**
- Table view of all 7 days
- Toggle "Closed" status for each day
- Time inputs (disabled when day is closed)
- Inline editing mode
- Visual status badges (Open/Closed)
- Color-coded closed days

**Data Structure:**
```javascript
{
  day: "Monday",
  open_time: "09:00",
  close_time: "18:00",
  is_closed: false
}
```

**Props:**
- `hours` - Array of daily hour objects
- `onUpdate` - Callback with updated hours
- `locationId` - Location ID

---

### 6. **TimeSlotsEditor** (`TimeSlotsEditor.jsx`)
Manages multiple time slots per day (e.g., morning and afternoon shifts).

**Features:**
- Add new time slots with form
- Organize slots by day
- Optional break times
- Edit mode for inline modifications
- Delete individual slots
- Grouped display by day

**Data Structure:**
```javascript
{
  id: 1,
  day_of_week: "Monday",
  slot_number: 1,
  open_time: "09:00",
  close_time: "12:00",
  break_start: null,
  break_end: null
}
```

**Props:**
- `slots` - Array of time slot objects
- `onUpdate` - Callback with updated slots
- `locationId` - Location ID

---

### 7. **HolidayExceptionsEditor** (`HolidayExceptionsEditor.jsx`)
Manages special hours or closures on holidays.

**Features:**
- Date picker for holiday dates
- Holiday name and notes
- Toggle open/closed status
- Add holidays with form
- Edit mode for modifications
- Delete individual holidays
- Automatically sorts by date

**Data Structure:**
```javascript
{
  id: 1,
  holiday_date: "2025-12-25",
  holiday_name: "Christmas Day",
  is_closed: true,
  notes: ""
}
```

**Props:**
- `holidays` - Array of holiday objects
- `onUpdate` - Callback with updated holidays
- `locationId` - Location ID

---

## Styling

All components have accompanying CSS files in `src/styles/`:

| Component | CSS File |
|-----------|----------|
| BusinessHoursManager | BusinessHoursManager.css |
| LocationList | LocationList.css |
| LocationForm | LocationForm.css |
| LocationDetail | LocationDetail.css |
| RegularHoursEditor | RegularHoursEditor.css |
| TimeSlotsEditor | TimeSlotsEditor.css |
| HolidayExceptionsEditor | HolidayExceptionsEditor.css |

### Design Highlights:
- **Color Scheme**: Purple gradient (#667eea → #764ba2)
- **Responsive**: Mobile-first design with breakpoints at 1024px and 768px
- **Accessibility**: Proper labels, semantic HTML, keyboard navigation
- **Visual Feedback**: Hover effects, status badges, error highlighting
- **Cards & Shadows**: Modern depth and hierarchy

---

## View Flow

```
App
├── Manage Hours (BusinessHoursManager)
│   ├── List View (LocationList)
│   │   ├── Add Location → LocationForm
│   │   ├── View Location → LocationDetail
│   │   │   ├── Tab: Regular Hours → RegularHoursEditor
│   │   │   ├── Tab: Time Slots → TimeSlotsEditor
│   │   │   └── Tab: Holiday Exceptions → HolidayExceptionsEditor
│   │   └── Edit Location → LocationForm
│   └── Add View (LocationForm)
└── Display Hours (BusinessHours) - Existing component
```

---

## Data Model

### Location Object
```javascript
{
  id: 1,
  name: "Main Office",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zip_code: "10001",
  regularHours: [...],
  timeSlots: [...],
  holidays: [...]
}
```

---

## Navigation

Updated `App.jsx` now includes two main navigation tabs:
1. **Manage Hours** - Access CRUD interface (default view)
2. **Display Hours** - View public business hours display

Toggle between views using the top navigation buttons.

---

## Future Enhancements

### API Integration
Replace sample data with real API calls:
- `GET /api/locations` - Fetch all locations
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location
- Similar endpoints for hours, slots, and holidays

### Form Examples (to be implemented):
```javascript
// Add location
const response = await fetch('/api/locations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(locationData)
});

// Update hours
const response = await fetch(`/api/locations/${locationId}/hours`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(hoursData)
});
```

### Additional Features to Consider:
- [ ] Bulk import/export locations
- [ ] Schedule templates
- [ ] Recurring holidays
- [ ] Staff assignment to time slots
- [ ] Audit logging
- [ ] Multi-language support
- [ ] Time zone handling
- [ ] Business hours validation
- [ ] Undo/Redo functionality

---

## Testing the Implementation

1. Click "Manage Hours" tab in navigation
2. View the location list with sample data
3. Click "View & Manage" on a location to see the detail page
4. Switch between tabs to manage:
   - Regular business hours
   - Multiple time slots per day
   - Holiday exceptions
5. Use "Edit Hours" button to modify values
6. Add/Edit/Delete operations with confirmation dialogs
7. Use "Edit Location Info" to modify address details

---

## Keyboard Navigation & Accessibility

- All buttons and inputs are keyboard accessible
- Tab navigation works through all form fields
- Enter key submits forms
- Escape key can cancel some actions (recommend implementation)
- Status badges provide color + text indicators (not relying on color alone)
- Error messages are associated with form fields

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox used throughout
- Time input fields (`<input type="time">`) supported in all modern browsers
- Date input fields (`<input type="date">`) with fallback support

---

## Performance Notes

- Uses React hooks (useState, useEffect) for state management
- Sample data can be replaced with pagination for large datasets
- Consider memoization for components if dealing with many locations
- Optimize re-renders with useCallback for event handlers (future improvement)

