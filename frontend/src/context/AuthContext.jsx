import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage on load (Session Persistence)
    try {
      const userInfo = localStorage.getItem('userInfo');
      // Token is usually stored inside userInfo or separately, check both
      const token = localStorage.getItem('token');

      if (userInfo) {
        // Handle potential corrupt data
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser && token) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      // Optional: Clear corrupt data
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- LOGIN ACTION ---
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });

      // Save session
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);

      // ROLE-BASED REDIRECTION
      if (data.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/'); // Buyers go to shop (Home)
      }

      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // --- REGISTER ACTION (Updated) ---
  const register = async (name, email, password, role) => {
    try {
      await api.post('/users', { name, email, password, role });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};