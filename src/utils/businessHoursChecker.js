/**
 * Business Hours Checker Utility
 * Provides helper functions to check business hours, holidays, and status
 */

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Convert time string (HH:MM or HH:MM:SS) to minutes since midnight
 * @param {string|number} time - Time in HH:MM format or hour as number
 * @returns {number} Minutes since midnight
 */
export const timeToMinutes = (time) => {
  if (typeof time === 'number') {
    return time * 60;
  }
  
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to HH:MM format
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in HH:MM format
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Format time to 12-hour AM/PM format
 * @param {string|number} time - Time in various formats
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (time) => {
  if (!time && time !== 0) return 'Closed';
  
  let hour, minute = 0;
  
  if (typeof time === 'string') {
    const parts = time.split(':');
    hour = parseInt(parts[0], 10);
    minute = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  } else {
    hour = parseInt(time, 10);
  }
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const minuteStr = String(minute).padStart(2, '0');
  
  return `${displayHour}:${minuteStr} ${period}`;
};

/**
 * Check if a date is a holiday
 * @param {Date} date - Date to check
 * @param {Array} holidays - Array of holiday objects with 'date' property
 * @returns {Object|null} Holiday object if found, null otherwise
 */
export const getHolidayOnDate = (date, holidays = []) => {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.find(h => h.date === dateStr) || null;
};

/**
 * Check if business is open at a specific time
 * @param {Date} dateTime - Date and time to check
 * @param {Object} businessHours - Business hours object with day names as keys
 * @param {Array} holidays - Array of holiday exceptions
 * @returns {boolean} True if business is open
 */
export const isBusinessOpen = (dateTime, businessHours, holidays = []) => {
  // Check if it's a holiday
  const holiday = getHolidayOnDate(dateTime, holidays);
  if (holiday && holiday.closed) {
    return false;
  }

  const dayName = daysOfWeek[dateTime.getDay()];
  const hours = businessHours[dayName];

  if (!hours || !hours.open || !hours.close) {
    return false;
  }

  const currentMinutes = dateTime.getHours() * 60 + dateTime.getMinutes();
  const openMinutes = timeToMinutes(hours.open);
  const closeMinutes = timeToMinutes(hours.close);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

/**
 * Get the next time the business opens
 * @param {Date} dateTime - Starting date/time
 * @param {Object} businessHours - Business hours object
 * @param {Array} holidays - Array of holiday exceptions
 * @returns {Object} Object with date, time, and description
 */
export const getNextOpeningTime = (dateTime, businessHours, holidays = []) => {
  const currentDate = new Date(dateTime);
  const dayName = daysOfWeek[currentDate.getDay()];
  const hours = businessHours[dayName];

  // Check if opens later today
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const openMinutes = timeToMinutes(hours.open || 0);

  if (hours.open && currentMinutes < openMinutes) {
    return {
      date: new Date(currentDate),
      timeStr: hours.open,
      description: `Opens at ${formatTime(hours.open)} today`,
      isToday: true
    };
  }

  // Find next opening day
  for (let i = 1; i <= 365; i++) {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + i);
    const nextDayName = daysOfWeek[nextDay.getDay()];
    const nextHours = businessHours[nextDayName];

    // Check if it's a holiday (closed)
    const holiday = getHolidayOnDate(nextDay, holidays);
    if (holiday && holiday.closed) {
      continue;
    }

    if (nextHours && nextHours.open) {
      const dayDisplay = nextDay.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      return {
        date: nextDay,
        timeStr: nextHours.open,
        description: `Opens at ${formatTime(nextHours.open)} on ${dayDisplay}`,
        isToday: false
      };
    }
  }

  return {
    date: null,
    timeStr: null,
    description: 'Call for hours',
    isToday: false
  };
};

/**
 * Get business status summary
 * @param {Date} dateTime - Date and time to check
 * @param {Object} businessHours - Business hours object
 * @param {Array} holidays - Array of holiday exceptions
 * @returns {Object} Status object
 */
export const getBusinessStatus = (dateTime, businessHours, holidays = []) => {
  const isOpen = isBusinessOpen(dateTime, businessHours, holidays);
  const holiday = getHolidayOnDate(dateTime, holidays);
  const dayName = daysOfWeek[dateTime.getDay()];
  const dayHours = businessHours[dayName];

  let nextEvent;
  if (isOpen && dayHours) {
    nextEvent = {
      type: 'closing',
      description: `Closes at ${formatTime(dayHours.close)}`
    };
  } else {
    const nextOpening = getNextOpeningTime(dateTime, businessHours, holidays);
    nextEvent = {
      type: 'opening',
      description: nextOpening.description
    };
  }

  return {
    isOpen,
    holiday: holiday || null,
    currentDay: dayName,
    currentHours: dayHours,
    nextEvent,
    timestamp: dateTime
  };
};

/**
 * Format hours for display
 * @param {Object} hoursObject - Hours object with open/close times
 * @returns {string} Formatted hours string
 */
export const formatHours = (hoursObject) => {
  if (!hoursObject || !hoursObject.open || !hoursObject.close) {
    return 'Closed';
  }
  return `${formatTime(hoursObject.open)} - ${formatTime(hoursObject.close)}`;
};

/**
 * Get week schedule
 * @param {Object} businessHours - Business hours object
 * @returns {Array} Array of daily schedule objects
 */
export const getWeekSchedule = (businessHours) => {
  return daysOfWeek.map(day => ({
    day,
    hours: businessHours[day],
    formattedHours: formatHours(businessHours[day])
  }));
};
