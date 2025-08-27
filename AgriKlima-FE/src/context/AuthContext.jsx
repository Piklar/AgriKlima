// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (token) {
        try {
          const response = await api.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error("Auth bootstrap failed:", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, [token]);

  // --- THIS IS THE CRITICAL FIX ---
  const login = async (email, password) => {
    try {
      // 1. Get the token from the login API
      const response = await api.loginUser({ email, password });
      if (!response?.data?.access) {
        throw new Error("Login response did not include an access token.");
      }
      
      const newToken = response.data.access;
      localStorage.setItem('authToken', newToken);
      setToken(newToken); // Set token to trigger the interceptor for the next call

      // 2. Immediately fetch the user profile with the new token
      const userProfileResponse = await api.getProfile();
      setUser(userProfileResponse.data);
      
      // 3. Return the user data so the LoginPage can redirect correctly
      return userProfileResponse.data;

    } catch (error) {
      logout(); // Clean up on any login failure
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, isAuthenticated: !!user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};