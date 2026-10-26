import axios from 'axios';

// Backend Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach auth tokens if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ati_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Seamless error logging & status handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[ATI Axios Client] Backend request notice:', error.message);
    return Promise.reject(error);
  }
);

export default api;
