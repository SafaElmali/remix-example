import axios from 'axios';

// Create a custom axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
