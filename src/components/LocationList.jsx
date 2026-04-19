import '../styles/LocationList.css';

const LocationList = ({ locations, onAdd, onView, onEdit, onDelete }) =>
{
    return (
        <div className="location-list-container">
            <div className="list-header">
                <h2>Business Locations</h2>
                <button className="btn btn-primary" onClick={onAdd}>
                    + Add New Location
                </button>
            </div>

            {locations.length === 0 ? (
                <div className="empty-state">
                    <p>No locations found. Create your first location to get started!</p>
                    <button className="btn btn-primary" onClick={onAdd}>
                        Add Location
                    </button>
                </div>
            ) : (
                <div className="locations-list" role="list">
                    {locations.map((location) => (
                        <article key={location.id} className="location-list-item" role="listitem">
                            <div className="location-main">
                                <div className="location-summary">
                                    <div className="location-heading">
                                        <h3>{location.name}</h3>
                                        <span className="category-badge">{location.category || 'General'}</span>
                                    </div>

                                    <p className="address">
                                        {location.address}, {location.city}, {location.state} {location.zip_code}
                                    </p>
                                </div>

                                <div className="location-meta" aria-label="Location summary">
                                    <span className="meta-pill">
                                        <strong>{location.regularHours?.filter(h => !h.is_closed).length || 0}/7</strong> days open
                                    </span>
                                    <span className="meta-pill">
                                        <strong>{location.timeSlots?.length || 0}</strong> slots
                                    </span>
                                    <span className="meta-pill">
                                        <strong>{location.holidays?.length || 0}</strong> holidays
                                    </span>
                                </div>
                            </div>

                            <div className="location-item-actions">
                                <button
                                    className="btn-icon"
                                    title="Edit"
                                    onClick={() => onEdit(location)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-icon btn-danger"
                                    title="Delete"
                                    onClick={() => onDelete(location.id)}
                                >
                                    🗑️
                                </button>
                            </div>

                            <div className="location-secondary">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => onView(location)}
                                >
                                    View & Manage
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationList;
