import axios from 'axios';

// The backend is running on port 5000 by default in server.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can attach tokens here if using localStorage instead of cookies
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized -> redirect to login)
    return Promise.reject(error);
  }
);

export default api;
