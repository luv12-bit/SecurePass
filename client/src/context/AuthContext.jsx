import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../services/api';
import CONFIG from '../config';

// I use React Context here so that any component in the app can check
// if the user is logged in, and what their role is, without passing props everywhere
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On first load, check if theres already a token saved from a previous session
  // If yes, call /auth/me to get the user data so they stay logged in
  useEffect(() => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    
    if (token) {
      console.log('Found existing token, verifying with server...');
      apiClient.get('/auth/me')
        .then((res) => {
          console.log('Token valid, user:', res.data.user || res.data.data);
          setUser(res.data.user || res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          // token was invalid or expired, clear it
          console.log('Token invalid, clearing:', err.message);
          localStorage.removeItem(CONFIG.TOKEN_KEY);
          setUser(null);
          setLoading(false);
        });
    } else {
      // no token at all, just show the public pages
      setLoading(false);
    }
  }, []);

  // Login function - called from the Login page when user submits the form
  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      
      // save the JWT token so the user stays logged in even after refresh
      localStorage.setItem(CONFIG.TOKEN_KEY, res.data.token);
      setUser(res.data.user);
      console.log('Login success! Role:', res.data.user.role);
      
      toast.success('Login successful!');
      
      // redirect to the correct dashboard based on their role
      // I use if-else here because each role has a different dashboard
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'security') navigate('/security');
      else if (res.data.user.role === 'employee') navigate('/employee');
      else navigate('/');
      
      return true;
    } catch (err) {
      console.log('Login failed:', err.response?.data?.message || err.message);
      toast.error('Login failed. Check your email and password.');
      return false;
    }
  };

  // Logout just clears everything and sends user to login
  const logout = () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    setUser(null);
    navigate('/login');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
