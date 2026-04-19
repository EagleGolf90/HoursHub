const parseJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

const request = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  return parseJson(response);
};

export const hoursApi = {
  async getAllLocations() {
    const data = await request('/api/locations');
    return data.locations;
  },

  async getAllCategories() {
    const data = await request('/api/categories');
    return data.categories;
  },

  getLocation(locationId) {
    return request(`/api/locations/${locationId}`);
  },

  createLocation(locationData) {
    return request('/api/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  },

  updateLocation(locationId, locationData) {
    return request(`/api/locations/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  },

  deleteLocation(locationId) {
    return request(`/api/locations/${locationId}`, {
      method: 'DELETE',
    });
  },
};