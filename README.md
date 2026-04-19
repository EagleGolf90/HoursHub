# Business Hours Website

A clean and modern website to display business hours and check whether a business is currently open or closed.

## Features

- 🟢 **Real-time Status**: Displays whether the business is currently open or closed
- ⏰ **Current Time Display**: Shows the current time in a clear, large format
- 📅 **Business Hours Schedule**: Complete weekly schedule with all operating hours
- 🔔 **Next Status Change**: Automatically shows when the business will open or close
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient background with smooth animations and transitions
- 🔄 **Auto-Update**: Updates every minute to reflect current status changes

## Business Hours (Default Configuration)

| Day | Hours |
|---|---|
| Monday | 9:00 AM - 6:00 PM |
| Tuesday | 9:00 AM - 6:00 PM |
| Wednesday | 9:00 AM - 6:00 PM |
| Thursday | 9:00 AM - 6:00 PM |
| Friday | 9:00 AM - 8:00 PM |
| Saturday | 10:00 AM - 4:00 PM |
| Sunday | Closed |

## Installation

1. Navigate to the project directory:
```bash
cd d:\Projects\HoursHub
```

2. Install dependencies (already done, but if needed):
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:5173/`

## Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Customizing Business Hours

Edit the `businessHours` object in `src/components/BusinessHours.jsx` to change the operating hours:

```javascript
const businessHours = {
  Monday: { open: 9, close: 18 },      // 9:00 AM - 6:00 PM
  Tuesday: { open: 9, close: 18 },
  // ... more days
  Sunday: { open: null, close: null }, // Closed
};
```

Use 24-hour format where:
- Hours are specified as numbers (0-23)
- Set both to `null` to mark the day as closed

## Customizing Colors and Styling

All styling is contained in `src/styles/BusinessHours.css`. You can customize:
- **Background gradient**: Edit the `linear-gradient` in `.business-hours-container`
- **Status colors**: Change the green (#22c55e) and red (#ef4444) colors for open/closed states
- **Font and spacing**: Adjust font sizes and padding values throughout

## Project Structure

```
src/
├── components/
│   └── BusinessHours.jsx      # Main business hours component
├── styles/
│   └── BusinessHours.css      # Component styling
├── App.jsx                     # Main app component
├── index.css                   # Global styles
└── main.jsx                    # App entry point
```

## Technologies Used

- **React 18**: UI library
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with gradients and animations

## Features Explanation

### Status Indicator
- **Green light + "We are Open"**: Business is currently accepting customers
- **Red light + "We are Closed"**: Business is not currently operating
- Pulsing animation on the status light for visibility

### Time Display
- Shows current time in 12-hour format with AM/PM
- Updates automatically every minute
- Monospace font for better readability

### Next Status
- When open: Shows the closing time
- When closed: Shows when the business will open next (today or on the next business day)

### Hours Schedule
- Color-coded grid showing all seven days
- Today's row is highlighted with the gradient color
- Hours displayed in 24-hour format (e.g., 09:00 - 18:00)
- "Closed" displayed for non-operating days

## Browser Support

Works on all modern browsers including:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Notes

- The business hours check updates every 60 seconds
- Time zones are based on the user's local system time
- The website automatically calculates the next open day when the business is closed
