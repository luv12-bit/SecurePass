/**
 * Application Configuration
 */

const CONFIG = {
  // Automatically use the live backend in production, and localhost during local development
  API_BASE_URL: import.meta.env.MODE === 'production' 
    ? 'https://securepass-6vck.onrender.com/api' 
    : 'http://localhost:5000/api',
  
  // Storage keys
  TOKEN_KEY: 'securepass_token',
  
  // App constants
  ROLES: {
    ADMIN: 'admin',
    SECURITY: 'security',
    EMPLOYEE: 'employee',
    VISITOR: 'visitor'
  },
  
  THEME: {
    PRIMARY: '#2563eb',
    ACCENT: '#14b8a6',
    BG_MAIN: '#0f172a'
  }
};

export default CONFIG;
