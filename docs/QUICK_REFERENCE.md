# HoursHub CRUD - Quick Reference

## 🚀 Getting Started

```bash
npm run dev
# Visit http://localhost:5173
# Click "Manage Hours" tab
```

---

## 📱 Components Overview

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **BusinessHoursManager** | Main hub | State management, view routing |
| **LocationList** | Browse locations | Grid view, card layout, quick actions |
| **LocationForm** | Add/Edit location | Form validation, address fields |
| **LocationDetail** | Manage one location | Tabbed interface, 3 sections |
| **RegularHoursEditor** | Daily hours | 7 days, open/close times, status |
| **TimeSlotsEditor** | Multiple shifts | Add shifts, breaks, organize by day |
| **HolidayExceptionsEditor** | Special dates | Date picker, closed toggle, notes |

---

## 📂 File Structure

```
src/
├── components/
│   ├── BusinessHoursManager.jsx ✨
│   ├── LocationList.jsx ✨
│   ├── LocationForm.jsx ✨
│   ├── LocationDetail.jsx ✨
│   ├── RegularHoursEditor.jsx ✨
│   ├── TimeSlotsEditor.jsx ✨
│   ├── HolidayExceptionsEditor.jsx ✨
│   ├── BusinessHours.jsx (existing)
│   └── NearbyBusinesses.jsx (existing)
├── styles/
│   ├── BusinessHoursManager.css ✨
│   ├── LocationList.css ✨
│   ├── LocationForm.css ✨
│   ├── LocationDetail.css ✨
│   ├── RegularHoursEditor.css ✨
│   ├── TimeSlotsEditor.css ✨
│   ├── HolidayExceptionsEditor.css ✨
│   └── BusinessHours.css (existing)
└── App.jsx (updated)

✨ = New files
```

---

## 🎯 Main Workflows

### Add Location
1. Click "Manage Hours" → "Add New Location"
2. Fill form (name, address, city, state, zip)
3. Submit → Auto-creates with default hours (9-5, closed Sunday)

### Edit Hours
1. Click "View & Manage" on location card
2. Go to "Regular Hours" tab
3. Click "Edit Hours"
4. Toggle "Closed" or change times
5. Save Changes

### Add Time Slot
1. Location Detail → "Time Slots" tab
2. Click "+ Add Time Slot"
3. Select day, set open/close times
4. Optional: Add break times
5. Add Slot

### Add Holiday
1. Location Detail → "Holiday Exceptions" tab
2. Click "+ Add Holiday"
3. Pick date, enter name
4. Toggle "Closed" if not operating
5. Add Holiday

### Delete Entry
Click 🗑️ icon on any entry → Confirm

---

## 🎨 Color Scheme

```css
Primary:     #667eea (Purple)
Secondary:   #764ba2 (Dark Purple)
Success:     #d4edda (Light Green)
Error:       #f8d7da (Light Red)
Neutral:     #e0e0e0 (Light Gray)
```

---

## 📊 Data Formats

### Regular Hours
```javascript
{
  day: "Monday",
  open_time: "09:00",      // 24-hour
  close_time: "18:00",
  is_closed: false
}
```

### Time Slot
```javascript
{
  id: 1,
  day_of_week: "Monday",
  slot_number: 1,
  open_time: "09:00",
  close_time: "12:00",
  break_start: null,       // optional
  break_end: null          // optional
}
```

### Holiday
```javascript
{
  id: 1,
  holiday_date: "2025-12-25",  // YYYY-MM-DD
  holiday_name: "Christmas",
  is_closed: true,             // true = closed
  notes: ""
}
```

---

## 🔌 Backend Integration

Replace sample data in `BusinessHoursManager.jsx`:

```javascript
// GET locations
const response = await fetch('/api/locations');
const data = await response.json();

// POST location
await fetch('/api/locations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(locationData)
});

// PUT location
await fetch(`/api/locations/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedData)
});

// DELETE location
await fetch(`/api/locations/${id}`, {
  method: 'DELETE'
});
```

---

## 🎛️ Component Props

### LocationList
```javascript
<LocationList
  locations={[...]}           // array
  onAdd={handleAdd}           // function
  onView={handleView}         // function
  onEdit={handleEdit}         // function
  onDelete={handleDelete}     // function
/>
```

### LocationForm
```javascript
<LocationForm
  location={locationObj}      // optional
  onSubmit={handleSubmit}     // function
  onCancel={handleCancel}     // function
  title="Add New Location"    // string
/>
```

### LocationDetail
```javascript
<LocationDetail
  location={locationObj}      // required
  onEdit={handleEdit}         // function
  onDelete={handleDelete}     // function
  onBack={handleBack}         // function
  onLocationUpdate={handleUpdate} // function
/>
```

### Editors
```javascript
<RegularHoursEditor
  hours={[...]}               // array
  onUpdate={handleUpdate}     // function
  locationId={id}             // number
/>

<TimeSlotsEditor
  slots={[...]}               // array
  onUpdate={handleUpdate}     // function
  locationId={id}             // number
/>

<HolidayExceptionsEditor
  holidays={[...]}            // array
  onUpdate={handleUpdate}     // function
  locationId={id}             // number
/>
```

---

## 🛠️ Customization Tips

### Change Primary Color
File: `src/styles/BusinessHoursManager.css`
```css
.btn-primary {
  background-color: #YOUR_COLOR;
}
```

### Add New Location Fields
File: `src/components/LocationForm.jsx`
1. Add new input field
2. Add to form state
3. Add validation
4. Update data structure

### Change Table Styling
File: `src/styles/*Editor.css`
- Modify `thead` background
- Change cell padding
- Adjust colors

### Modify Validation
File: `src/components/LocationForm.jsx`
- Update `validateForm()` function
- Change error messages
- Add/remove rules

---

## 📱 Responsive Breakpoints

```css
Desktop:  > 1024px   /* Multi-column grid *)
Tablet:   768-1024px /* 2-column layout *)
Mobile:   < 768px    /* Single column *)
```

---

## 🐛 Debugging Tips

### Check State
```javascript
console.log('Locations:', locations);
console.log('Selected:', selectedLocation);
```

### Verify API Calls
```javascript
// In browser DevTools
Network tab → Watch fetch requests
Console → Check for errors
```

### Test Sample Data
Current implementation uses hardcoded sample data. Check `BusinessHoursManager.jsx` `sampleLocations` object.

---

## 📝 Documentation Files

- **CRUD_PAGES_SUMMARY.md** ← Start here
- **CRUD_PAGES_DOCUMENTATION.md** ← Detailed specs
- **CRUD_IMPLEMENTATION_GUIDE.md** ← Backend integration

---

## ✅ Checklist

- [ ] Run `npm run dev`
- [ ] Click "Manage Hours" tab
- [ ] View sample locations
- [ ] Click "View & Manage"
- [ ] Test editing hours
- [ ] Add a time slot
- [ ] Add a holiday
- [ ] Try deleting entries
- [ ] Test on mobile view
- [ ] Review styling
- [ ] Plan backend integration

---

## 🚀 What's Next?

1. **Test thoroughly** - Try all CRUD operations
2. **Customize styling** - Match your brand
3. **Connect backend** - Replace sample data with API calls
4. **Add features** - Bulk operations, imports, templates

---

## 📞 Support

For detailed information, check:
- Component documentation: `CRUD_PAGES_DOCUMENTATION.md`
- Implementation guide: `CRUD_IMPLEMENTATION_GUIDE.md`
- Code comments in component files

---

**Status**: ✅ Ready to use with sample data | ⏳ Ready for backend integration

