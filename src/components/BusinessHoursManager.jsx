import { useState, useEffect } from 'react';
import LocationList from './LocationList';
import LocationForm from './LocationForm';
import LocationDetail from './LocationDetail';
import { hoursApi } from '../utils/hoursApi';
import '../styles/BusinessHoursManager.css';

const BusinessHoursManager = () =>
{
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [view, setView] = useState('list'); // 'list', 'add', 'edit', 'detail'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Load locations
    useEffect(() =>
    {
        void loadLocations();
    }, []);

    const loadLocations = async () =>
    {
        setLoading(true);
        try
        {
            const [locationData, categoryData] = await Promise.all([
                hoursApi.getAllLocations(),
                hoursApi.getAllCategories(),
            ]);

            setLocations(locationData);
            setCategories(categoryData.map((category) => category.name));
            setError(null);
        } catch (err)
        {
            setError('Failed to load locations');
            console.error(err);
        } finally
        {
            setLoading(false);
        }
    };

    const handleAddLocation = async (locationData) =>
    {
        try
        {
            const newLocation = await hoursApi.createLocation({
                ...locationData,
                regularHours: initializeRegularHours(),
                timeSlots: [],
                holidays: [],
            });
            setLocations((currentLocations) => [...currentLocations, newLocation]);
            setCategories((currentCategories) => (
                currentCategories.includes(newLocation.category)
                    ? currentCategories
                    : [...currentCategories, newLocation.category].sort()
            ));
            setError(null);
            setSuccess('Location added successfully');
            setView('list');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err)
        {
            setError('Failed to add location');
            console.error(err);
        }
    };

    const handleEditLocation = async (locationData) =>
    {
        try
        {
            const updatedLocation = await hoursApi.updateLocation(locationData.id, locationData);
            setLocations(locations.map(loc =>
                loc.id === locationData.id ? updatedLocation : loc
            ));
            setCategories((currentCategories) => (
                currentCategories.includes(updatedLocation.category)
                    ? currentCategories
                    : [...currentCategories, updatedLocation.category].sort()
            ));
            setError(null);
            setSuccess('Location updated successfully');
            setView('detail');
            setSelectedLocation(updatedLocation);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err)
        {
            setError('Failed to update location');
            console.error(err);
        }
    };

    const handleDeleteLocation = async (locationId) =>
    {
        if (!window.confirm('Are you sure you want to delete this location?')) return;

        try
        {
            await hoursApi.deleteLocation(locationId);
            setLocations(locations.filter(loc => loc.id !== locationId));
            setError(null);
            setSuccess('Location deleted successfully');
            setView('list');
            setSelectedLocation(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err)
        {
            setError('Failed to delete location');
            console.error(err);
        }
    };

    const handleViewLocation = (location) =>
    {
        setSelectedLocation(location);
        setView('detail');
    };

    const handleAddLocationClick = () =>
    {
        setSelectedLocation(null);
        setView('add');
    };

    const handleEditLocationClick = (location) =>
    {
        setSelectedLocation(location);
        setView('edit');
    };

    const handleBack = () =>
    {
        setView('list');
        setSelectedLocation(null);
    };

    const initializeRegularHours = () =>
    {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.map(day => ({
            day,
            open_time: day === 'Sunday' ? null : '09:00',
            close_time: day === 'Sunday' ? null : '17:00',
            is_closed: day === 'Sunday',
        }));
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="business-hours-manager">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {view === 'list' && (
                <LocationList
                    locations={locations}
                    onAdd={handleAddLocationClick}
                    onView={handleViewLocation}
                    onEdit={handleEditLocationClick}
                    onDelete={handleDeleteLocation}
                />
            )}

            {view === 'add' && (
                <LocationForm
                    categories={categories}
                    onSubmit={handleAddLocation}
                    onCancel={handleBack}
                    title="Add New Location"
                />
            )}

            {view === 'edit' && selectedLocation && (
                <LocationForm
                    location={selectedLocation}
                    categories={categories}
                    onSubmit={handleEditLocation}
                    onCancel={handleBack}
                    title="Edit Location"
                />
            )}

            {view === 'detail' && selectedLocation && (
                <LocationDetail
                    location={selectedLocation}
                    onEdit={handleEditLocationClick}
                    onDelete={handleDeleteLocation}
                    onBack={handleBack}
                    onLocationUpdate={handleEditLocation}
                />
            )}
        </div>
    );
};

export default BusinessHoursManager;
