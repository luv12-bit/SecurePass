import axios from 'axios';
import CONFIG from '../config';

/**
 * Axioss instance with base configuration
 */
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Attach JWT Token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Handle Global Errors (like 401)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect if unauthorized
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
