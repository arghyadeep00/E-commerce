import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies (if backend sets HttpOnly cookies)
});

// Add a request interceptor to inject JWT token from js-cookie
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get("token");
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration/401s
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login or refresh token)
      console.error("Unauthorized! Redirecting to login...");
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
