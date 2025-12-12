import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Farm API calls
export const farmAPI = {
  getAllFarms: () => apiClient.get('/farms'),
  getFarmById: (id) => apiClient.get(`/farms/${id}`),
  createFarm: (farm) => apiClient.post('/farms', farm),
  updateFarm: (id, farm) => apiClient.put(`/farms/${id}`, farm),
  deleteFarm: (id) => apiClient.delete(`/farms/${id}`),
};

// Sensor readings API
export const readingAPI = {
  getReadings: (farmId, days = 7) =>
    apiClient.get(`/farms/${farmId}/readings?days=${days}`),
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || `Error: ${error.response.status}`;
  }
  if (error.request) {
    return 'No response from server. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred';
};

export default apiClient;
