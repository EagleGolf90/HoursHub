# Business Hours CRUD Implementation Guide

## Quick Start

The Business Hours CRUD pages are now fully integrated into your HoursHub application. Here's how to use them:

### Running the Application

```bash
npm run dev
```

Then navigate to `http://localhost:5173` in your browser.

---

## Using the CRUD Pages

### 1. Accessing the Management Interface

- Click the **"Manage Hours"** tab in the top navigation
- You'll see a list of existing locations (pre-populated with sample data)

### 2. Viewing a Location

Click **"View & Manage"** on any location card to:
- See all business hours details
- Switch between three tabs:
  - 📅 **Regular Hours** - Daily schedules (Monday-Sunday)
  - 🔄 **Time Slots** - Multiple shifts per day with breaks
  - 🎉 **Holiday Exceptions** - Special hours/closures for holidays

### 3. Adding a New Location

1. Click **"+ Add New Location"** button
2. Fill in the form:
   - Location Name
   - Street Address
   - City
   - State (2 letters)
   - ZIP Code
3. Click **"Add Location"**
4. New location appears in the list with default hours (9-5, closed Sundays)

### 4. Editing Location Information

From the location detail page:
1. Click **"Edit Location Info"** button
2. Modify address details
3. Click **"Update Location"**

### 5. Managing Regular Hours

**For each day of the week:**

1. Click **"Edit Hours"** button
2. Toggle the **"Closed"** checkbox to mark day as closed
3. When open, set:
   - **Open Time** (e.g., 09:00)
   - **Close Time** (e.g., 18:00)
4. Click **"Save Changes"**

**Visual Indicators:**
- Green "Open" badges = Operating
- Red "Closed" badges = Not operating

### 6. Managing Time Slots

**To add multiple shifts on the same day:**

1. Click **"+ Add Time Slot"** button
2. Select:
   - **Day** - Which day of the week
   - **Slot Number** - Order of this slot (1st, 2nd, etc.)
   - **Open Time** - Shift starts
   - **Close Time** - Shift ends
   - **Break Start/End** (optional) - Lunch breaks, etc.
3. Click **"Add Slot"**

**To edit existing slots:**

1. Click **"Edit Slots"** button
2. Modify open/close times inline
3. Click **"Save Changes"**

**To delete a slot:**

1. Click the 🗑️ icon on the slot
2. Confirm deletion

### 7. Managing Holiday Exceptions

**To add a holiday:**

1. Click **"+ Add Holiday"** button
2. Fill in:
   - **Date** - The holiday date
   - **Holiday Name** - e.g., "Christmas Day"
   - **Closed** checkbox - Toggle if closed or has special hours
   - **Notes** (optional) - Special hours or details
3. Click **"Add Holiday"**

**To edit a holiday:**

1. Click **"Edit Holidays"** button
2. Modify any field
3. Click **"Save Changes"**

**To delete a holiday:**

1. Click the 🗑️ icon
2. Confirm deletion

---

## Understanding the Data Structure

### Regular Hours
Each location has 7 entries (one per day):
```javascript
{
  day: "Monday",
  open_time: "09:00",      // 24-hour format
  close_time: "18:00",     // 24-hour format
  is_closed: false         // true if location is closed
}
```

### Time Slots
Multiple shifts on the same day:
```javascript
{
  id: 1,
  day_of_week: "Monday",
  slot_number: 1,          // Order of this slot
  open_time: "09:00",
  close_time: "12:00",
  break_start: null,       // Optional
  break_end: null          // Optional
}
```

### Holiday Exceptions
Special hours for holidays:
```javascript
{
  id: 1,
  holiday_date: "2025-12-25",     // YYYY-MM-DD format
  holiday_name: "Christmas Day",
  is_closed: true,                 // true = closed, false = open
  notes: "Special hours available"
}
```

---

## Connecting to Your Backend

The current implementation uses sample data. To connect to a real database:

### 1. Update BusinessHoursManager.jsx

Replace the `loadLocations` function:

```javascript
const loadLocations = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/locations');
    const data = await response.json();
    setLocations(data);
    setError(null);
  } catch (err) {
    setError('Failed to load locations');
  } finally {
    setLoading(false);
  }
};
```

### 2. Add Location

```javascript
const handleAddLocation = async (locationData) => {
  try {
    const response = await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });
    const newLocation = await response.json();
    setLocations([...locations, newLocation]);
    setSuccess('Location added successfully');
    setView('list');
  } catch (err) {
    setError('Failed to add location');
  }
};
```

### 3. Update Location

```javascript
const handleEditLocation = async (locationData) => {
  try {
    const response = await fetch(`/api/locations/${locationData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });
    const updated = await response.json();
    setLocations(locations.map(loc => 
      loc.id === updated.id ? updated : loc
    ));
    setSuccess('Location updated successfully');
  } catch (err) {
    setError('Failed to update location');
  }
};
```

### 4. Delete Location

```javascript
const handleDeleteLocation = async (locationId) => {
  if (!window.confirm('Are you sure?')) return;
  try {
    await fetch(`/api/locations/${locationId}`, { method: 'DELETE' });
    setLocations(locations.filter(loc => loc.id !== locationId));
    setSuccess('Location deleted successfully');
    setView('list');
  } catch (err) {
    setError('Failed to delete location');
  }
};
```

### 5. Update Hours

Similarly, update the hour editors to call API endpoints:
- `PUT /api/locations/:id/hours` - Update regular hours
- `POST/PUT /api/locations/:id/timeslots` - Manage time slots
- `POST/PUT /api/locations/:id/holidays` - Manage holidays

---

## Example API Endpoints

Your backend should provide these endpoints:

```
Locations:
  GET    /api/locations                    # List all
  POST   /api/locations                    # Create
  PUT    /api/locations/:id                # Update
  DELETE /api/locations/:id                # Delete

Regular Hours:
  GET    /api/locations/:id/hours          # Get all hours for location
  PUT    /api/locations/:id/hours          # Update all hours

Time Slots:
  GET    /api/locations/:id/timeslots      # Get all slots
  POST   /api/locations/:id/timeslots      # Add slot
  PUT    /api/locations/:id/timeslots/:id  # Update slot
  DELETE /api/locations/:id/timeslots/:id  # Delete slot

Holidays:
  GET    /api/locations/:id/holidays       # Get all holidays
  POST   /api/locations/:id/holidays       # Add holiday
  PUT    /api/locations/:id/holidays/:id   # Update holiday
  DELETE /api/locations/:id/holidays/:id   # Delete holiday
```

---

## File Structure

```
src/
├── components/
│   ├── BusinessHoursManager.jsx        # Main CRUD coordinator
│   ├── LocationList.jsx                # Location grid/list view
│   ├── LocationForm.jsx                # Add/Edit location form
│   ├── LocationDetail.jsx              # Single location detail view
│   ├── RegularHoursEditor.jsx          # Daily hours editor
│   ├── TimeSlotsEditor.jsx             # Multiple shifts editor
│   └── HolidayExceptionsEditor.jsx     # Holiday editor
├── styles/
│   ├── BusinessHoursManager.css
│   ├── LocationList.css
│   ├── LocationForm.css
│   ├── LocationDetail.css
│   ├── RegularHoursEditor.css
│   ├── TimeSlotsEditor.css
│   └── HolidayExceptionsEditor.css
└── App.jsx                              # Updated with manager tab
```

---

## Validation Rules

The system enforces these validations:

### Location Form
- ✅ Location Name - Required, non-empty
- ✅ Address - Required, non-empty
- ✅ City - Required, non-empty
- ✅ State - Required, max 2 characters
- ✅ ZIP Code - Required, non-empty

### Hours Editor
- ✅ Can toggle any day as "Closed"
- ✅ Time inputs disabled when day is closed
- ✅ Expects HH:MM format (24-hour)

### Time Slots
- ✅ Open and Close times required
- ✅ Slot number must be positive
- ✅ Break times optional
- ✅ Allows multiple slots per day

### Holidays
- ✅ Date required
- ✅ Holiday name required
- ✅ Notes optional
- ✅ Auto-sorted by date

---

## Styling & Customization

### Colors
- Primary: #667eea (purple)
- Secondary: #764ba2 (dark purple)
- Success: #d4edda (light green)
- Error: #f8d7da (light red)
- Neutral: #e0e0e0 (light gray)

### Changing Colors
Update the CSS files, specifically:
- `src/styles/BusinessHoursManager.css` - Button colors
- `src/styles/RegularHoursEditor.css` - Table colors
- All component CSS files use these variables

### Responsive Breakpoints
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

---

## Common Tasks

### Export Location Data
```javascript
// Add this function to BusinessHoursManager
const exportAsJSON = (location) => {
  const json = JSON.stringify(location, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${location.name}-hours.json`;
  a.click();
};
```

### Bulk Import
```javascript
const importFromJSON = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // Process and add to locations
    } catch (err) {
      alert('Invalid JSON format');
    }
  };
  reader.readAsText(file);
};
```

### Duplicate Location
Copy an existing location with pre-filled hours as a template for new locations.

---

## Troubleshooting

### No locations showing
- Check that sample data is properly initialized
- Verify browser console for errors
- Ensure all component files are in place

### Time inputs not working
- Some browsers require specific date/time picker implementations
- Consider using a library like `react-datetime-picker` for better UX

### Styling looks broken
- Verify all CSS files are imported
- Check for CSS conflicts with existing styles
- Ensure CSS file paths are correct

### Form validation not working
- Check browser console for JavaScript errors
- Verify validation logic in form components

---

## Next Steps

1. ✅ **Current**: CRUD pages fully functional with sample data
2. **Next**: Connect to your backend API
3. **Future**: Add advanced features like:
   - Bulk operations
   - Import/Export
   - Staff schedules
   - Recurring patterns
   - Analytics dashboard

For detailed component documentation, see [CRUD_PAGES_DOCUMENTATION.md](./CRUD_PAGES_DOCUMENTATION.md)

