// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUserDetails = useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getProfile();
      setUser(response.data);
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const login = async (identifier, password) => {
    try {
      // Send identifier (can be email or mobile number) and password
      const response = await api.loginUser({ identifier, password });
      
      if (response?.data?.access) {
        const newToken = response.data.access;
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        
        // Fetch user profile after successful login
        const userProfileResponse = await api.getProfile();
        setUser(userProfileResponse.data);
        return userProfileResponse.data;
      } else {
        throw new Error("Login response did not include an access token.");
      }
    } catch (error) {
      console.error("Login error:", error);
      logout();
      throw error;
    }
  };

  const value = { 
    token, 
    user, 
    isAuthenticated: !!user && !!token, 
    loading, 
    login, 
    logout, 
    fetchUserDetails 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};