import axios from 'axios';

// In production: set REACT_APP_API_URL=https://your-app.onrender.com/api in Vercel env vars
// In development: falls back to localhost:5000
const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s timeout — important for Render free tier cold starts
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expired → redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
