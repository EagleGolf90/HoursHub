import { useState } from 'react';
import RegularHoursEditor from './RegularHoursEditor';
import TimeSlotsEditor from './TimeSlotsEditor';
import HolidayExceptionsEditor from './HolidayExceptionsEditor';
import '../styles/LocationDetail.css';

const LocationDetail = ({ location, onEdit, onDelete, onBack, onLocationUpdate }) =>
{
    const [activeTab, setActiveTab] = useState('hours');

    const handleRegularHoursUpdate = (updatedHours) =>
    {
        const updatedLocation = {
            ...location,
            regularHours: updatedHours,
        };
        onLocationUpdate(updatedLocation);
    };

    const handleTimeSlotUpdate = (updatedSlots) =>
    {
        const updatedLocation = {
            ...location,
            timeSlots: updatedSlots,
        };
        onLocationUpdate(updatedLocation);
    };

    const handleHolidayUpdate = (updatedHolidays) =>
    {
        const updatedLocation = {
            ...location,
            holidays: updatedHolidays,
        };
        onLocationUpdate(updatedLocation);
    };

    return (
        <div className="location-detail-container">
            <div className="detail-header">
                <div className="header-content">
                    <button className="btn-back" onClick={onBack}>← Back</button>
                    <div>
                        <h1>{location.name}</h1>
                        <p className="location-category">{location.category || 'General'}</p>
                        <p className="location-address">
                            {location.address}, {location.city}, {location.state} {location.zip_code}
                        </p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => onEdit(location)}
                    >
                        Edit Location Info
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() =>
                        {
                            if (window.confirm('Are you sure you want to delete this location?'))
                            {
                                onDelete(location.id);
                            }
                        }}
                    >
                        Delete Location
                    </button>
                </div>
            </div>

            <div className="detail-tabs">
                <button
                    className={`tab-button ${activeTab === 'hours' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hours')}
                >
                    📅 Regular Hours
                </button>
                <button
                    className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
                    onClick={() => setActiveTab('slots')}
                >
                    🔄 Time Slots
                </button>
                <button
                    className={`tab-button ${activeTab === 'holidays' ? 'active' : ''}`}
                    onClick={() => setActiveTab('holidays')}
                >
                    🎉 Holiday Exceptions
                </button>
            </div>

            <div className="detail-content">
                {activeTab === 'hours' && (
                    <RegularHoursEditor
                        hours={location.regularHours || []}
                        onUpdate={handleRegularHoursUpdate}
                        locationId={location.id}
                    />
                )}

                {activeTab === 'slots' && (
                    <TimeSlotsEditor
                        slots={location.timeSlots || []}
                        onUpdate={handleTimeSlotUpdate}
                        locationId={location.id}
                    />
                )}

                {activeTab === 'holidays' && (
                    <HolidayExceptionsEditor
                        holidays={location.holidays || []}
                        onUpdate={handleHolidayUpdate}
                        locationId={location.id}
                    />
                )}
            </div>
        </div>
    );
};

export default LocationDetail;
