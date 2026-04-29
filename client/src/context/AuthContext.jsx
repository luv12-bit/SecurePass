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
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    
    if (token) {
      // Basic fetch without advanced try/catch wrappers
      apiClient.get('/auth/me')
        .then((res) => {
          setUser(res.data.user || res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem(CONFIG.TOKEN_KEY);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      
      // Save token directly
      localStorage.setItem(CONFIG.TOKEN_KEY, res.data.token);
      setUser(res.data.user);
      
      toast.success('Login successful!');
      
      // Simple routing
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'security') navigate('/security');
      else if (res.data.user.role === 'employee') navigate('/employee');
      else navigate('/');
      
      return true;
    } catch (err) {
      console.log(err);
      toast.error('Login failed. Check your email and password.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    setUser(null);
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
