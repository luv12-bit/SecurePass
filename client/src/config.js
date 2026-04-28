/**
 * Application Configuration
 */

const CONFIG = {
  // Use localhost for testing the new Socket.io features locally
  API_BASE_URL: 'http://localhost:5000/api',
  
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
