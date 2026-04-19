# HoursHub CRUD Pages - Visual User Guide

## 🎯 Navigation Map

```
┌─────────────────────────────────────────┐
│         HoursHub Header                 │
│  [🕐 HoursHub]   [Manage Hours] [Display Hours] │
└─────────────────────────────────────────┘
                    ↓
         ┌──────────────────────┐
         │  MANAGE HOURS VIEW   │
         └──────────────────────┘
                    ↓
      ┌─────────────────────────────┐
      │   Location List (Grid)      │
      │  ┌──────────┐ ┌──────────┐ │
      │  │ Location │ │ Location │ │
      │  │  Card 1  │ │  Card 2  │ │
      │  └────┬─────┘ └────┬─────┘ │
      │       │            │       │
      │       [+ Add]      [...]   │
      └───────┼────────────┼───────┘
              │            │
              ↓            ↓
         [Edit]  [Delete] [View & Manage]
              │            │
              ↓            ↓
         Edit Form    Detail Page
                    (with 3 tabs)
                    ┌────────────────┐
                    │ Regular Hours  │
                    ├────────────────┤
                    │  Time Slots    │
                    ├────────────────┤
                    │ Holiday Except │
                    └────────────────┘
```

---

## 📋 Location Card Layout

```
┌────────────────────────────────────────┐
│ 🏢 Location Name            [✏️] [🗑️]   │ ← Header
├────────────────────────────────────────┤
│ Address: 123 Main St                   │
│ New York, NY 10001                     │
│                                        │
│ Open Days: 6/7  │ Slots: 2 │ Holidays: 1 │ ← Stats
├────────────────────────────────────────┤
│           [View & Manage →]            │ ← Action Button
└────────────────────────────────────────┘
```

---

## 📝 Location Form

```
┌──────────────────────────────────────────┐
│      Add New Location / Edit Location    │
├──────────────────────────────────────────┤
│                                          │
│  Location Name *                         │
│  [________________________]               │
│                                          │
│  Street Address *                        │
│  [________________________]               │
│                                          │
│  City *          State *       ZIP *     │
│  [_______]       [__]         [_____]   │
│                                          │
│  [Cancel]              [Add Location]    │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🏢 Location Detail Page

```
┌──────────────────────────────────────────┐
│ [←Back] Main Office                      │
│         123 Main St, New York, NY 10001 │
│                    [Edit Info] [Delete]  │
├──────────────────────────────────────────┤
│ [📅 Regular Hours] [🔄 Time Slots] [🎉 Holidays] │
├──────────────────────────────────────────┤
│                                          │
│  Content changes based on selected tab  │
│                                          │
└──────────────────────────────────────────┘
```

---

## 📅 Regular Hours Tab

```
┌──────────────────────────────────────────┐
│ Regular Business Hours    [Edit Hours]   │
├────────────┬──────────┬──────────┬────────┤
│ Day        │ Status   │ Open     │ Close  │
├────────────┼──────────┼──────────┼────────┤
│ Monday     │ [Open]   │ 09:00    │ 18:00  │
│ Tuesday    │ [Open]   │ 09:00    │ 18:00  │
│ Wednesday  │ [Open]   │ 09:00    │ 18:00  │
│ Thursday   │ [Open]   │ 09:00    │ 18:00  │
│ Friday     │ [Open]   │ 09:00    │ 20:00  │
│ Saturday   │ [Open]   │ 10:00    │ 16:00  │
│ Sunday     │[Closed]  │ —        │ —      │
├────────────┴──────────┴──────────┴────────┤
│                                            │
│  When [Edit Hours] is clicked:             │
│  ☑ Closed │ 09:00  │ 18:00  │ [Save]    │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔄 Time Slots Tab

```
┌────────────────────────────────────────┐
│ Multiple Time Slots [+ Add] [Edit]    │
├────────────────────────────────────────┤
│                                        │
│ ┌── Add Time Slot Form (collapsed) ─┐ │
│ │ Day: [Monday    ▼]                 │ │
│ │ Open: [09:00]  Close: [12:00]      │ │
│ │ Break: [12:00] - [13:00]           │ │
│ │         [Add Slot]                 │ │
│ └────────────────────────────────────┘ │
│                                        │
│ MONDAY                                 │
│ ├─ Slot 1: 09:00 - 12:00              │
│ └─ Slot 2: 13:00 - 18:00 (Break: 12-13)│
│                                        │
│ FRIDAY                                 │
│ ├─ Slot 1: 09:00 - 12:00              │
│ └─ Slot 2: 13:00 - 20:00 (Break: 12-13)│
│                                        │
└────────────────────────────────────────┘
```

---

## 🎉 Holiday Exceptions Tab

```
┌────────────────────────────────────────┐
│ Holiday Exceptions [+ Add] [Edit]    │
├────────────────────────────────────────┤
│                                        │
│ ┌── Add Holiday Form (collapsed) ─┐   │
│ │ Date: [2025-12-25]               │   │
│ │ Name: [Christmas Day]            │   │
│ │ ☑ Closed                         │   │
│ │ Notes: [optional]                │   │
│ │        [Add Holiday]             │   │
│ └────────────────────────────────────┘   │
│                                        │
├────────────┬──────────────┬────────────┤
│ Date       │ Holiday Name │ Status [🗑️]│
├────────────┼──────────────┼────────────┤
│ Jan 1      │ New Year Day │ [Closed]   │
│ Dec 25     │ Christmas    │ [Closed]   │
│ Jul 4      │ Independence │ [Closed]   │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎨 Color Legend

```
┌─────────────────────────────────────┐
│ Status Indicators:                  │
│ ✅ [Open]   - Green background      │
│ ❌ [Closed] - Red background        │
│                                     │
│ Buttons:                            │
│ 🟦 Primary - Purple (#667eea)       │
│ ⬜ Secondary - Gray (#e0e0e0)       │
│ 🟥 Danger - Red (#ef5350)           │
│                                     │
│ States:                             │
│ ✨ Enabled - Full color             │
│ ⬜ Disabled - Grayed out            │
│ 🔵 Focused - Purple outline         │
│                                     │
│ Alerts:                             │
│ 🟩 Success - Light green            │
│ 🟥 Error - Light red                │
└─────────────────────────────────────┘
```

---

## ⌨️ Keyboard Navigation

```
Tab     →  Move to next field/button
Shift+Tab→ Move to previous field/button
Enter   →  Submit form / Click button
Space   →  Toggle checkbox
Escape  →  Close dialog (when implemented)
```

---

## 📱 Mobile View Example

```
┌─────────────────────────────────┐
│ 🕐 HoursHub                 ☰   │ ← Hamburger menu
├─────────────────────────────────┤
│ Business Locations              │
│                                 │
│ ┌────────────────────────────┐  │
│ │ Main Office        [✏️][🗑️] │  │
│ │                            │  │
│ │ 123 Main St,              │  │
│ │ New York, NY              │  │
│ │                            │  │
│ │ Open: 6/7                 │  │
│ │ Slots: 2                  │  │
│ │ Holidays: 1               │  │
│ │                            │  │
│ │ [View & Manage]           │  │
│ └────────────────────────────┘  │
│                                 │
│ [+ Add New Location]            │
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 User Action Flow

### Adding a Location
```
Start
  ↓
[+ Add New Location]
  ↓
LocationForm
  ├─ Validate inputs
  ├─ Show errors if invalid
  └─ On valid submit:
     ├─ Create location
     ├─ Initialize hours
     └─ Return to list
     
Show success message ✅
List updates with new location
```

### Editing Hours
```
Start
  ↓
[View & Manage]
  ↓
LocationDetail → Regular Hours tab
  ↓
[Edit Hours]
  ↓
Edit mode enabled
  ├─ Time inputs enabled
  ├─ Checkboxes visible
  └─ Save/Cancel buttons shown
  
[Save Changes]
  ├─ Validate times
  └─ Update location
  
Show success message ✅
Exit edit mode
```

### Adding Holiday
```
Start
  ↓
LocationDetail → Holiday Exceptions tab
  ↓
[+ Add Holiday]
  ↓
Form opens
  ├─ Date picker
  ├─ Name field
  ├─ Status toggle
  └─ Notes field
  
[Add Holiday]
  ├─ Validate date & name
  └─ Add to list & sort by date
  
Show success message ✅
New holiday appears in table
```

---

## 🎯 Quick Reference: Icons & Symbols

| Symbol | Meaning |
|--------|---------|
| ✏️ | Edit |
| 🗑️ | Delete |
| ✅ | Success / Complete |
| ❌ | Error / Closed |
| 📅 | Calendar / Dates |
| 🔄 | Repeat / Multiple |
| 🎉 | Special / Holidays |
| 🕐 | Time / Clock |
| 🏢 | Location / Building |
| ← | Back / Previous |
| → | Next / Forward |
| + | Add / New |
| - | Remove / Subtract |

---

## 📊 Typical User Sessions

### Session 1: Initial Setup (10-15 min)
```
1. View sample locations [2 min]
2. Click View & Manage [1 min]
3. Review current hours [2 min]
4. Edit regular hours [3 min]
5. Add holiday exceptions [3 min]
6. Explore time slots [3 min]
```

### Session 2: Add New Location (5-10 min)
```
1. Click Add New Location [1 min]
2. Fill location form [2 min]
3. Submit [1 min]
4. View & Manage new location [2 min]
5. Set specific hours [3 min]
```

### Session 3: Daily Maintenance (5 min)
```
1. View locations [1 min]
2. Quick hour edits [2 min]
3. Update holidays [2 min]
```

---

## ✨ Interactive Elements

All these elements are clickable/interactive:

```
Buttons:           [Primary] [Secondary] [Danger]
Inputs:            [Text fields] [Date picker] [Time picker]
Toggles:           ☑ Checkbox  ○ Radio (future)
Tabs:              [Tab 1] [Tab 2] [Tab 3]
Cards:             Clickable for detail view
Links:             [Back] [View & Manage]
Icons:             [✏️] [🗑️] [+]
Dropdowns:         [Select ▼]
Tables:            Rows are interactive
Forms:             Submit with [Button]
```

---

## 🎬 Animation & Transitions

- **Card hover**: Slight lift effect
- **Button hover**: Color change + shadow
- **Form validation**: Instant feedback
- **Tab switching**: Smooth content transition
- **Modal/Alert**: Slide in animation
- **Status update**: Color change + confirmation

---

**This visual guide helps you navigate the CRUD interface intuitively!**

