import { useState } from 'react';
import '../styles/HolidayExceptionsEditor.css';

const HolidayExceptionsEditor = ({ holidays, onUpdate }) =>
{
    const [holidayList, setHolidayList] = useState(holidays);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHoliday, setNewHoliday] = useState({
        holiday_date: '',
        holiday_name: '',
        is_closed: true,
        notes: '',
    });
    const [errors, setErrors] = useState({});

    const validateHoliday = (holiday) =>
    {
        const newErrors = {};
        if (!holiday.holiday_date) newErrors.holiday_date = 'Date is required';
        if (!holiday.holiday_name.trim()) newErrors.holiday_name = 'Holiday name is required';
        return newErrors;
    };

    const handleAddHoliday = () =>
    {
        const newErrors = validateHoliday(newHoliday);
        if (Object.keys(newErrors).length > 0)
        {
            setErrors(newErrors);
            return;
        }

        const updatedHolidays = [
            ...holidayList,
            {
                id: Math.max(...holidayList.map(h => h.id || 0), 0) + 1,
                ...newHoliday,
                notes: newHoliday.notes || '',
            },
        ].sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date));

        setHolidayList(updatedHolidays);
        onUpdate(updatedHolidays);

        setNewHoliday({
            holiday_date: '',
            holiday_name: '',
            is_closed: true,
            notes: '',
        });
        setErrors({});
        setShowAddForm(false);
    };

    const handleDeleteHoliday = (id) =>
    {
        if (window.confirm('Delete this holiday exception?'))
        {
            const updatedHolidays = holidayList.filter(h => h.id !== id);
            setHolidayList(updatedHolidays);
            onUpdate(updatedHolidays);
        }
    };

    const handleEditHoliday = (id, field, value) =>
    {
        const updatedHolidays = holidayList.map(h =>
            h.id === id ? { ...h, [field]: value } : h
        );
        setHolidayList(updatedHolidays);
    };

    const handleSaveEdit = () =>
    {
        onUpdate(holidayList);
        setIsEditing(false);
    };

    const formatDate = (dateString) =>
    {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="holiday-exceptions-editor">
            <div className="editor-header">
                <h3>Holiday Exceptions</h3>
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
                                {showAddForm ? '✕ Cancel' : '+ Add Holiday'}
                            </button>
                            {holidayList.length > 0 && (
                                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                    Edit Holidays
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="add-holiday-form">
                    <h4>Add Holiday Exception</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date *</label>
                            <input
                                type="date"
                                value={newHoliday.holiday_date}
                                onChange={(e) =>
                                {
                                    setNewHoliday({ ...newHoliday, holiday_date: e.target.value });
                                    if (errors.holiday_date) setErrors({ ...errors, holiday_date: '' });
                                }}
                            />
                            {errors.holiday_date && <span className="error-text">{errors.holiday_date}</span>}
                        </div>

                        <div className="form-group">
                            <label>Holiday Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Christmas Day"
                                value={newHoliday.holiday_name}
                                onChange={(e) =>
                                {
                                    setNewHoliday({ ...newHoliday, holiday_name: e.target.value });
                                    if (errors.holiday_name) setErrors({ ...errors, holiday_name: '' });
                                }}
                            />
                            {errors.holiday_name && <span className="error-text">{errors.holiday_name}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={newHoliday.is_closed}
                                    onChange={(e) => setNewHoliday({ ...newHoliday, is_closed: e.target.checked })}
                                />
                                Closed on this holiday
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <input
                                type="text"
                                placeholder="e.g., Special hours: 10am-4pm"
                                value={newHoliday.notes}
                                onChange={(e) => setNewHoliday({ ...newHoliday, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleAddHoliday}>
                        Add Holiday
                    </button>
                </div>
            )}

            {holidayList.length === 0 ? (
                <div className="empty-state">
                    <p>No holiday exceptions configured. Add holidays where regular hours don't apply.</p>
                </div>
            ) : (
                <div className="holidays-table-wrapper">
                    <table className="holidays-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Holiday Name</th>
                                <th>Status</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidayList.map(holiday => (
                                <tr key={holiday.id}>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={holiday.holiday_date}
                                                onChange={(e) => handleEditHoliday(holiday.id, 'holiday_date', e.target.value)}
                                            />
                                        ) : (
                                            formatDate(holiday.holiday_date)
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={holiday.holiday_name}
                                                onChange={(e) => handleEditHoliday(holiday.id, 'holiday_name', e.target.value)}
                                            />
                                        ) : (
                                            holiday.holiday_name
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={holiday.is_closed}
                                                    onChange={(e) => handleEditHoliday(holiday.id, 'is_closed', e.target.checked)}
                                                />
                                                {holiday.is_closed ? 'Closed' : 'Open'}
                                            </label>
                                        ) : (
                                            <span className={`status-badge ${holiday.is_closed ? 'closed' : 'open'}`}>
                                                {holiday.is_closed ? 'Closed' : 'Open'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={holiday.notes || ''}
                                                onChange={(e) => handleEditHoliday(holiday.id, 'notes', e.target.value)}
                                            />
                                        ) : (
                                            holiday.notes || '—'
                                        )}
                                    </td>
                                    <td>
                                        {!isEditing && (
                                            <button
                                                className="btn-icon btn-danger"
                                                onClick={() => handleDeleteHoliday(holiday.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HolidayExceptionsEditor;
