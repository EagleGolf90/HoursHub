import { useState } from 'react';
import '../styles/NearbyBusinesses.css';

const NearbyBusinesses = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [radius, setRadius] = useState(5); // in kilometers

  // Sample business data with coordinates
  const sampleBusinesses = [
    {
      id: 1,
      name: 'CVS Pharmacy - Downtown',
      type: 'Pharmacy',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      latitude: 40.7128,
      longitude: -74.0060,
      hours: { Monday: '9:00 AM - 6:00 PM', Friday: '9:00 AM - 8:00 PM', Sunday: 'Closed' },
      phone: '(212) 555-0123',
    },
    {
      id: 2,
      name: 'Walgreens - Midtown',
      type: 'Pharmacy',
      address: '456 Park Avenue',
      city: 'New York',
      state: 'NY',
      latitude: 40.7580,
      longitude: -73.9855,
      hours: { Monday: '8:00 AM - 5:00 PM', Friday: '8:00 AM - 7:00 PM', Sunday: '10:00 AM - 4:00 PM' },
      phone: '(212) 555-0456',
    },
    {
      id: 3,
      name: 'Target - Brooklyn',
      type: 'Retail',
      address: '789 Broadway',
      city: 'Brooklyn',
      state: 'NY',
      latitude: 40.6892,
      longitude: -73.9760,
      hours: { Monday: '9:00 AM - 9:00 PM', Friday: '9:00 AM - 10:00 PM', Sunday: '10:00 AM - 8:00 PM' },
      phone: '(718) 555-0789',
    },
    {
      id: 4,
      name: 'McDonald\'s - Chelsea',
      type: 'Restaurant',
      address: '321 8th Avenue',
      city: 'New York',
      state: 'NY',
      latitude: 40.7505,
      longitude: -73.9972,
      hours: { Monday: '6:00 AM - 11:00 PM', Friday: '6:00 AM - 12:00 AM', Sunday: '6:00 AM - 11:00 PM' },
      phone: '(212) 555-0321',
    },
    {
      id: 5,
      name: 'Starbucks - Union Square',
      type: 'Cafe',
      address: '14 Union Square',
      city: 'New York',
      state: 'NY',
      latitude: 40.7350,
      longitude: -73.9908,
      hours: { Monday: '5:30 AM - 8:00 PM', Friday: '5:30 AM - 9:00 PM', Sunday: '6:00 AM - 8:00 PM' },
      phone: '(212) 555-0135',
    },
  ];

  const categories = ['All', ...new Set(sampleBusinesses.map((business) => business.type))];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLoading(false);
        },
        () => {
          setError('Unable to get your location. Please enable location services.');
          // Use default NYC location for demo
          setUserLocation({ latitude: 40.7128, longitude: -74.0060 });
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Filter businesses by distance and search query
  const filterNearbyBusinesses = (lat, lon, query = '', category = 'All') => {
    let filtered = sampleBusinesses.map((business) => {
      const distance = calculateDistance(lat, lon, business.latitude, business.longitude);
      return { ...business, distance };
    });

    // Filter by radius
    filtered = filtered.filter((business) => business.distance <= radius);

    if (category !== 'All') {
      filtered = filtered.filter((business) => business.type === category);
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.type.toLowerCase().includes(query.toLowerCase()) ||
          business.city.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    return filtered;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  // Handle radius change
  const handleRadiusChange = (e) => {
    const newRadius = parseFloat(e.target.value);
    setRadius(newRadius);
  };

  const filteredBusinesses = userLocation
    ? filterNearbyBusinesses(
      userLocation.latitude,
      userLocation.longitude,
      searchQuery,
      selectedCategory,
    )
    : [];

  return (
    <div className="nearby-businesses-container">
      <h1>Find Businesses Near You</h1>

      {error && <div className="error-message">{error}</div>}

      {!userLocation && (
        <div className="request-card">
          <h2>Step 1: Share your location</h2>
          <p>We need your location first so we can show nearby businesses before you choose a category.</p>
          <button onClick={getUserLocation} className="refresh-button" disabled={loading}>
            {loading ? 'Getting Location...' : 'Use My Location'}
          </button>
        </div>
      )}

      {userLocation && (
        <>
          <div className="location-info">
            <p>📍 Your Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</p>
          </div>

          <div className="search-filters">
            <div className="category-control">
              <label htmlFor="category-select">Step 2: Choose a category</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="category-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Refine by business name or city..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />

            <div className="radius-control">
              <label htmlFor="radius">Search Radius: {radius} km</label>
              <input
                id="radius"
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={radius}
                onChange={handleRadiusChange}
                className="radius-slider"
              />
            </div>

            <button onClick={getUserLocation} className="refresh-button" disabled={loading}>
              {loading ? 'Getting Location...' : 'Refresh Location'}
            </button>
          </div>
        </>
      )}

      <div className="businesses-list">
        {userLocation && filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <div key={business.id} className="business-card">
              <div className="business-header">
                <h2>{business.name}</h2>
                <span className="business-type">{business.type}</span>
              </div>

              <div className="business-info">
                <p className="address">📍 {business.address}, {business.city}, {business.state}</p>
                <p className="phone">📞 {business.phone}</p>
                <p className="distance">Distance: <strong>{business.distance.toFixed(2)} km</strong></p>
              </div>

              <div className="business-hours">
                <h3>Hours</h3>
                {Object.entries(business.hours).map(([day, hours]) => (
                  <p key={day}>
                    <span className="day">{day}:</span> {hours}
                  </p>
                ))}
              </div>
            </div>
          ))
        ) : userLocation ? (
          <div className="no-results">
            <p>No businesses found for {selectedCategory.toLowerCase()} within {radius} km. Try another category or radius.</p>
          </div>
        ) : (
          <div className="no-results">
            <p>Share your location to start browsing nearby businesses by category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyBusinesses;
