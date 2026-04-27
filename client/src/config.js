/**
 * Application Configuration
 */

const CONFIG = {
  // API base URL - Points to live Render backend
  API_BASE_URL: 'https://securepass-6vck.onrender.com/api',
  
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
