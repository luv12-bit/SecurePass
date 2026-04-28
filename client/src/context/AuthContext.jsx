import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../services/api';
import CONFIG from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem(CONFIG.TOKEN_KEY);
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data.user || res.data.data);
        } catch (err) {
          console.log("Auth error:", err);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      
      localStorage.setItem(CONFIG.TOKEN_KEY, res.data.token);
      setUser(res.data.user);
      
      toast.success('Welcome back!');
      
      // Redirect based on role
      const userRole = res.data.user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'security') {
        navigate('/security');
      } else if (userRole === 'employee') {
        navigate('/employee');
      } else {
        navigate('/');
      }
      
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Authentication failed. Please check credentials.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
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
