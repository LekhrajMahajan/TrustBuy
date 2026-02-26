import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextValue';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
        if (parsedUser && parsedUser.token) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('userInfo');
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

  // Helper: save session and navigate by role
  const saveSession = useCallback((data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setUser(data);

    if (data.role === 'seller') {
      navigate('/seller/dashboard');
    } else if (data.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [navigate]);

  // --- EMAIL/PASSWORD LOGIN ---
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      saveSession(data);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      let message = error.response?.data?.message || 'Login failed';
      if (error.message === 'Network Error') {
        message = 'Cannot connect to server. Please check your internet or try again later.';
      }
      return { success: false, message };
    }
  }, [saveSession]);

  // --- GOOGLE LOGIN ---
  const googleLogin = useCallback(async (access_token) => {
    try {
      const { data } = await api.post('/users/auth/google', { access_token });
      saveSession(data);
      return { success: true };
    } catch (error) {
      console.error("Google Login Error:", error);
      const message = error.response?.data?.message || 'Google login failed';
      return { success: false, message };
    }
  }, [saveSession]);

  // Check Status (For Polling or Refreshing Profile)
  const checkUserStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/users/profile');
      const currentUser = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh user status:", error);
    }
  }, []);

  // --- REGISTER ---
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
    <AuthContext.Provider value={{ user, login, googleLogin, register, logout, loading, checkUserStatus }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};