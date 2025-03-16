import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.status, error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login or refresh token
        console.error("Unauthorized access. Please log in again.");
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error("You don't have permission to access this resource.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Request Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);
