import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../services/api';
import CONFIG from '../config';

const AuthContext = createContext();

/**
 * AuthProvider Component
 * Manages global authentication state and user sessions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validate session on mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem(CONFIG.TOKEN_KEY);
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data.user || res.data.data);
        } catch (err) {
          // api service handles 401 cleaning
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  /**
   * Login handler
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      
      localStorage.setItem(CONFIG.TOKEN_KEY, res.data.token);
      setUser(res.data.user);
      
      toast.success('Welcome back!');
      
      // Dynamic Role-Based Redirect
      switch (res.data.user.role) {
        case CONFIG.ROLES.ADMIN: navigate('/admin'); break;
        case CONFIG.ROLES.SECURITY: navigate('/security'); break;
        case CONFIG.ROLES.EMPLOYEE: navigate('/employee'); break;
        default: navigate('/');
      }
      
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
      return false;
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
