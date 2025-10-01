import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // This ensures cookies are sent with requests
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add common headers
apiClient.interceptors.request.use(
  (config) => {
    // Add any common headers here if needed
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear user data from localStorage/Redux store
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Handle other common errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
