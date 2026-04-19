import { useState } from 'react';
import '../styles/LocationForm.css';

const LocationForm = ({ location, categories = [], onSubmit, onCancel, title }) =>
{
    const [formData, setFormData] = useState(location || {
        name: '',
        category: 'General',
        address: '',
        city: '',
        state: '',
        zip_code: '',
    });

    const [errors, setErrors] = useState({});

    const validateForm = () =>
    {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Location name is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
        return newErrors;
    };

    const handleChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name])
        {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0)
        {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="location-form-container">
            <div className="form-wrapper">
                <h2>{title}</h2>

                <form onSubmit={handleSubmit} className="location-form">
                    <div className="form-group">
                        <label htmlFor="name">Location Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Main Office, Downtown Branch"
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <input
                            type="text"
                            list="category-options"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g., Office, Retail, Healthcare"
                            className={errors.category ? 'error' : ''}
                        />
                        <datalist id="category-options">
                            {categories.map((category) => (
                                <option key={category} value={category} />
                            ))}
                        </datalist>
                        {errors.category && <span className="error-text">{errors.category}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Street Address *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g., 123 Main Street"
                            className={errors.address ? 'error' : ''}
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City *</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g., New York"
                                className={errors.city ? 'error' : ''}
                            />
                            {errors.city && <span className="error-text">{errors.city}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State *</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="e.g., NY"
                                maxLength="2"
                                className={errors.state ? 'error' : ''}
                            />
                            {errors.state && <span className="error-text">{errors.state}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="zip_code">ZIP Code *</label>
                            <input
                                type="text"
                                id="zip_code"
                                name="zip_code"
                                value={formData.zip_code}
                                onChange={handleChange}
                                placeholder="e.g., 10001"
                                className={errors.zip_code ? 'error' : ''}
                            />
                            {errors.zip_code && <span className="error-text">{errors.zip_code}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {location ? 'Update Location' : 'Add Location'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationForm;
