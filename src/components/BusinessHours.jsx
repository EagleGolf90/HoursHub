import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  isBusinessOpen,
  getNextOpeningTime,
  formatTime,
} from '../utils/businessHoursChecker';
import { hoursApi } from '../utils/hoursApi';
import '../styles/BusinessHours.css';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const defaultHours = {
  Monday: { open: '09:00', close: '18:00' },
  Tuesday: { open: '09:00', close: '18:00' },
  Wednesday: { open: '09:00', close: '18:00' },
  Thursday: { open: '09:00', close: '18:00' },
  Friday: { open: '09:00', close: '20:00' },
  Saturday: { open: '10:00', close: '16:00' },
  Sunday: { open: null, close: null },
};

const getLocationBusinessHours = (location, customHours) => {
  if (customHours) {
    return customHours;
  }

  if (!location?.regularHours) {
    return defaultHours;
  }

  return location.regularHours.reduce((hoursMap, entry) => {
    hoursMap[entry.day] = {
      open: entry.is_closed ? null : entry.open_time,
      close: entry.is_closed ? null : entry.close_time,
    };

    return hoursMap;
  }, { ...defaultHours });
};

const getLocationHolidays = (location) =>
  (location?.holidays || []).map((holiday) => ({
    date: holiday.holiday_date,
    name: holiday.holiday_name,
    closed: holiday.is_closed,
  }));

const calculateLocationStatus = (time, location, customHours, daysOfWeek) => {
  const businessHours = getLocationBusinessHours(location, customHours);
  const holidays = getLocationHolidays(location);
  const openStatus = isBusinessOpen(time, businessHours, holidays);
  const dayName = daysOfWeek[time.getDay()];
  const hours = businessHours[dayName];

  if (openStatus) {
    return {
      isOpen: true,
      nextStatusChange: hours?.close ? `Closes at ${formatTime(hours.close)}` : 'Closing time unknown',
    };
  }

  return {
    isOpen: false,
    nextStatusChange: getNextOpeningTime(time, businessHours, holidays).description,
  };
};

const BusinessHours = ({
  locationId,
  hours: customHours,
  showTimeSlots = true,
  showHolidays = true,
}) => {
  const params = useParams();
  const resolvedLocationId = Number.parseInt(params.locationId ?? locationId ?? '1', 10);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextStatusChange, setNextStatusChange] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBusinessData = async () => {
      setLoading(true);

      try {
        const location = await hoursApi.getLocation(resolvedLocationId);
        setSelectedLocation(location);
        setError(null);
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business details');
      } finally {
        setLoading(false);
      }
    };

    void loadBusinessData();
  }, [resolvedLocationId]);

  useEffect(() => {
    if (!selectedLocation) {
      return undefined;
    }

    const updateStatus = () => {
      const now = new Date();
      const status = calculateLocationStatus(now, selectedLocation, customHours, daysOfWeek);

      setCurrentTime(now);
      setIsOpen(status.isOpen);
      setNextStatusChange(status.nextStatusChange);
    };

    updateStatus();

    const timer = setInterval(() => {
      updateStatus();
    }, 60000);

    return () => clearInterval(timer);
  }, [customHours, selectedLocation]);

  const groupedTimeSlots = daysOfWeek
    .map((day) => ({
      day,
      slots: (selectedLocation?.timeSlots || []).filter((slot) => slot.day_of_week === day),
    }))
    .filter((daySlots) => daySlots.slots.length > 0);

  if (loading) return <div className="loading">Loading business hours...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!selectedLocation) return <div className="error">Business not found.</div>;

  return (
    <div className="business-hours-container">
      <div className="business-detail-shell">
        <div className="detail-topbar">
          <Link className="back-link" to="/businesses">
            ← Back to business names
          </Link>
          <span className="category-pill">{selectedLocation.category || 'General'}</span>
        </div>

        <div className="location-info">
          <h2>{selectedLocation.name}</h2>
          <p className="address">
            {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip_code}
          </p>
        </div>

        <div className={`status-card ${isOpen ? 'open' : 'closed'}`}>
          <div className="status-indicator">
            <div className={`status-light ${isOpen ? 'open' : 'closed'}`}></div>
            <h1 className="status-text">
              {isOpen ? 'Open right now' : 'Closed right now'}
            </h1>
          </div>

          <div className="current-time">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </div>

          <div className="next-status">{nextStatusChange}</div>
        </div>

        <div className="hours-schedule">
          <h3>Regular Hours</h3>
          <table className="hours-table">
            <tbody>
              {(selectedLocation.regularHours || []).map((day) => (
                <tr key={day.day} className={`day-row ${daysOfWeek[currentTime.getDay()] === day.day ? 'today' : ''}`}>
                  <td className="day-name">{day.day}</td>
                  <td className="day-hours">
                    {!day.is_closed && day.open_time && day.close_time
                      ? `${formatTime(day.open_time)} - ${formatTime(day.close_time)}`
                      : 'Closed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showTimeSlots && groupedTimeSlots.length > 0 && (
          <div className="time-slots content-card">
            <h3>Multiple Time Slots</h3>
            {groupedTimeSlots.map((daySlots) => (
              <div key={daySlots.day} className="day-slots">
                <h4>{daySlots.day}</h4>
                <div className="slots-list">
                  {daySlots.slots.map((slot) => (
                    <div key={slot.id || `${daySlots.day}-${slot.slot_number}`} className="slot-item">
                      <span className="slot-time">{formatTime(slot.open_time)} - {formatTime(slot.close_time)}</span>
                      {slot.break_start && slot.break_end && (
                        <span className="slot-break">Break: {formatTime(slot.break_start)} - {formatTime(slot.break_end)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showHolidays && selectedLocation.holidays.length > 0 && (
          <div className="holidays content-card">
            <h3>Holiday Exceptions</h3>
            <table className="holidays-table">
              <tbody>
                {selectedLocation.holidays.map((holiday) => (
                  <tr key={holiday.id || holiday.holiday_date}>
                    <td className="holiday-date">{new Date(holiday.holiday_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="holiday-name">{holiday.holiday_name}</td>
                    <td className="holiday-status">
                      {holiday.is_closed ? <span className="closed-badge">Closed</span> : <span className="open-badge">Open</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessHours;
