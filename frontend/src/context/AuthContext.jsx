import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextValue';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// AuthContext is now imported from ./AuthContextValue to support Fast Refresh

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage on load (Session Persistence)
    try {
      const userInfo = localStorage.getItem('userInfo');

      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        // Important: Ensure we have the user object AND it has a token (or we have a separate token)
        if (parsedUser && parsedUser.token) {
          // Set the Authorization header for future requests immediately
          // (Though your axios interceptor might handle this, it's safer to ensure state is set)
          setUser(parsedUser);
        } else {
          localStorage.removeItem('userInfo'); // Invalid data
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- LOGIN ACTION ---

  // --- LOGIN ACTION ---

  const login = useCallback(async (email, password) => {
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
      let message = error.response?.data?.message || 'Login failed';
      if (error.message === 'Network Error') {
        message = 'Cannot connect to server. Please check your internet or try again later.';
      }
      return { success: false, message };
    }
  }, [navigate]);

  // Check Status (For Polling or Refreshing Profile)
  const checkUserStatus = useCallback(async () => {
    try {
      // Need to import userService or make a direct call
      const { data } = await api.get('/users/profile');

      // Merge with existing token to keep session valid
      const currentUser = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...currentUser, ...data };

      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh user status:", error);
    }
  }, []);

  // --- REGISTER ACTION (Updated) ---
  const register = useCallback(async (name, email, password, role, address, city, pincode, phone) => {
    try {
      await api.post('/users', { name, email, password, role, address, city, pincode, phone });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, checkUserStatus }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};