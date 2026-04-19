import { useState } from 'react';
import '../styles/RegularHoursEditor.css';

const RegularHoursEditor = ({ hours, onUpdate }) =>
{
    const [editingHours, setEditingHours] = useState(hours);
    const [isEditing, setIsEditing] = useState(false);

    const handleToggleClosed = (day) =>
    {
        setEditingHours(prev => prev.map(h =>
            h.day === day
                ? { ...h, is_closed: !h.is_closed, open_time: null, close_time: null }
                : h
        ));
    };

    const handleTimeChange = (day, field, value) =>
    {
        setEditingHours(prev => prev.map(h =>
            h.day === day ? { ...h, [field]: value } : h
        ));
    };

    const handleSave = () =>
    {
        onUpdate(editingHours);
        setIsEditing(false);
    };

    const handleCancel = () =>
    {
        setEditingHours(hours);
        setIsEditing(false);
    };

    return (
        <div className="regular-hours-editor">
            <div className="editor-header">
                <h3>Regular Business Hours</h3>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Edit Hours
                    </button>
                )}
            </div>

            <div className="hours-table-wrapper">
                <table className="hours-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Status</th>
                            <th>Open Time</th>
                            <th>Close Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editingHours.map((hourEntry) => (
                            <tr key={hourEntry.day} className={hourEntry.is_closed ? 'closed-row' : ''}>
                                <td className="day-cell">{hourEntry.day}</td>
                                <td className="status-cell">
                                    {isEditing ? (
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={hourEntry.is_closed}
                                                onChange={() => handleToggleClosed(hourEntry.day)}
                                            />
                                            Closed
                                        </label>
                                    ) : (
                                        <span className={`status-badge ${hourEntry.is_closed ? 'closed' : 'open'}`}>
                                            {hourEntry.is_closed ? 'Closed' : 'Open'}
                                        </span>
                                    )}
                                </td>
                                <td className="time-cell">
                                    {isEditing ? (
                                        <input
                                            type="time"
                                            value={hourEntry.open_time || ''}
                                            onChange={(e) => handleTimeChange(hourEntry.day, 'open_time', e.target.value)}
                                            disabled={hourEntry.is_closed}
                                        />
                                    ) : (
                                        <span>{hourEntry.open_time || '—'}</span>
                                    )}
                                </td>
                                <td className="time-cell">
                                    {isEditing ? (
                                        <input
                                            type="time"
                                            value={hourEntry.close_time || ''}
                                            onChange={(e) => handleTimeChange(hourEntry.day, 'close_time', e.target.value)}
                                            disabled={hourEntry.is_closed}
                                        />
                                    ) : (
                                        <span>{hourEntry.close_time || '—'}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="editor-actions">
                    <button className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default RegularHoursEditor;
