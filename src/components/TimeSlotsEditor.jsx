import { useState } from 'react';
import '../styles/TimeSlotsEditor.css';

const TimeSlotsEditor = ({ slots, onUpdate }) =>
{
    const [timeSlots, setTimeSlots] = useState(slots);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSlot, setNewSlot] = useState({
        day_of_week: 'Monday',
        slot_number: 1,
        open_time: '09:00',
        close_time: '17:00',
        break_start: '',
        break_end: '',
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAddSlot = () =>
    {
        if (!newSlot.open_time || !newSlot.close_time)
        {
            alert('Please fill in all required fields');
            return;
        }

        const updatedSlots = [
            ...timeSlots,
            {
                id: Math.max(...timeSlots.map(s => s.id || 0), 0) + 1,
                ...newSlot,
                break_start: newSlot.break_start || null,
                break_end: newSlot.break_end || null,
            },
        ];

        setTimeSlots(updatedSlots);
        onUpdate(updatedSlots);

        setNewSlot({
            day_of_week: 'Monday',
            slot_number: 1,
            open_time: '09:00',
            close_time: '17:00',
            break_start: '',
            break_end: '',
        });
        setShowAddForm(false);
    };

    const handleDeleteSlot = (id) =>
    {
        if (window.confirm('Delete this time slot?'))
        {
            const updatedSlots = timeSlots.filter(s => s.id !== id);
            setTimeSlots(updatedSlots);
            onUpdate(updatedSlots);
        }
    };

    const handleEditSlot = (id, field, value) =>
    {
        const updatedSlots = timeSlots.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        setTimeSlots(updatedSlots);
    };

    const handleSaveEdit = () =>
    {
        onUpdate(timeSlots);
        setIsEditing(false);
    };

    const groupedByDay = days.reduce((acc, day) =>
    {
        acc[day] = timeSlots.filter(s => s.day_of_week === day);
        return acc;
    }, {});

    return (
        <div className="time-slots-editor">
            <div className="editor-header">
                <h3>Multiple Time Slots</h3>
                <div className="header-actions">
                    {isEditing ? (
                        <>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                Cancel Edit
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveEdit}>
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={() => setShowAddForm(!showAddForm)}>
                                {showAddForm ? '✕ Cancel' : '+ Add Time Slot'}
                            </button>
                            {timeSlots.length > 0 && (
                                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                    Edit Slots
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="add-slot-form">
                    <h4>Add New Time Slot</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Day</label>
                            <select
                                value={newSlot.day_of_week}
                                onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
                            >
                                {days.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Slot Number</label>
                            <input
                                type="number"
                                min="1"
                                value={newSlot.slot_number}
                                onChange={(e) => setNewSlot({ ...newSlot, slot_number: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Open Time *</label>
                            <input
                                type="time"
                                value={newSlot.open_time}
                                onChange={(e) => setNewSlot({ ...newSlot, open_time: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Close Time *</label>
                            <input
                                type="time"
                                value={newSlot.close_time}
                                onChange={(e) => setNewSlot({ ...newSlot, close_time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Break Start</label>
                            <input
                                type="time"
                                value={newSlot.break_start}
                                onChange={(e) => setNewSlot({ ...newSlot, break_start: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Break End</label>
                            <input
                                type="time"
                                value={newSlot.break_end}
                                onChange={(e) => setNewSlot({ ...newSlot, break_end: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleAddSlot}>
                        Add Slot
                    </button>
                </div>
            )}

            {timeSlots.length === 0 ? (
                <div className="empty-state">
                    <p>No time slots configured. Add one to allow multiple shifts per day.</p>
                </div>
            ) : (
                <div className="slots-by-day">
                    {Object.entries(groupedByDay).map(([day, daySlots]) => daySlots.length > 0 && (
                        <div key={day} className="day-section">
                            <h4>{day}</h4>
                            <div className="slots-list">
                                {daySlots.map(slot => (
                                    <div key={slot.id} className="slot-item">
                                        <div className="slot-info">
                                            {isEditing ? (
                                                <div className="slot-edit-form">
                                                    <div className="form-row-inline">
                                                        <input
                                                            type="time"
                                                            value={slot.open_time}
                                                            onChange={(e) => handleEditSlot(slot.id, 'open_time', e.target.value)}
                                                        />
                                                        <span>to</span>
                                                        <input
                                                            type="time"
                                                            value={slot.close_time}
                                                            onChange={(e) => handleEditSlot(slot.id, 'close_time', e.target.value)}
                                                        />
                                                    </div>
                                                    {slot.break_start && slot.break_end && (
                                                        <div className="break-info">
                                                            Break: {slot.break_start} - {slot.break_end}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="slot-times">
                                                        Slot {slot.slot_number}: {slot.open_time} - {slot.close_time}
                                                    </span>
                                                    {slot.break_start && slot.break_end && (
                                                        <span className="break-info">
                                                            Break: {slot.break_start} - {slot.break_end}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {!isEditing && (
                                            <button
                                                className="btn-icon btn-danger"
                                                onClick={() => handleDeleteSlot(slot.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimeSlotsEditor;
