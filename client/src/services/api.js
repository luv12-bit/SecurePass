import axios from 'axios';
import CONFIG from '../config';

// I create a reusable axios instance so I dont have to type the base URL every time
// all my API calls (login, register, getVisitors etc.) go through this
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST interceptor: runs before every API call
// this automatically attaches the JWT token from localStorage to every request
// so I don't have to manually add headers in every component
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // the server checks this header in middleware/auth.js to verify the user
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// RESPONSE interceptor: runs after every API response
// if the server says 401 (unauthorized), it means the token expired or is invalid
// so I clear it and send the user back to login
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    console.log('Got 401 - token might be expired, clearing it');
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    // only redirect if we're not already on the login page (avoids infinite loop)
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default apiClient;
