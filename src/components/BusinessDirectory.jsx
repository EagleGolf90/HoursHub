import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hoursApi } from '../utils/hoursApi';
import '../styles/BusinessDirectory.css';

const BusinessDirectory = () => {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDirectory = async () => {
      setLoading(true);

      try {
        const [locationData, categoryData] = await Promise.all([
          hoursApi.getAllLocations(),
          hoursApi.getAllCategories(),
        ]);

        setLocations(locationData);
        setCategories(categoryData.map((category) => category.name));
        setError(null);
      } catch (err) {
        console.error('Error loading business directory:', err);
        setError('Failed to load business names');
      } finally {
        setLoading(false);
      }
    };

    void loadDirectory();
  }, []);

  const filteredLocations = selectedCategory === 'all'
    ? locations
    : locations.filter((location) => (location.category || 'General') === selectedCategory);

  if (loading) {
    return <div className="directory-feedback">Loading business names...</div>;
  }

  if (error) {
    return <div className="directory-feedback error">{error}</div>;
  }

  return (
    <section className="business-directory">
      <header className="directory-hero">
        <p className="eyebrow">Business Directory</p>
        <h2>Choose a business name</h2>
        <p className="directory-copy">
          The first page shows names only. Select a business to open a separate details page with hours,
          address, holiday exceptions, and time slots.
        </p>
      </header>

      <div className="directory-filters" aria-label="Category filters">
        <button
          className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
          type="button"
        >
          All Categories
        </button>

        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      {filteredLocations.length === 0 ? (
        <div className="directory-feedback">No business names match the selected category.</div>
      ) : (
        <div className="business-name-list" role="list">
          {filteredLocations.map((location) => (
            <Link
              key={location.id}
              className="business-name-card"
              role="listitem"
              to={`/businesses/${location.id}`}
            >
              <span>{location.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default BusinessDirectory;