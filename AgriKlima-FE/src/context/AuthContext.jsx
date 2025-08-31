// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const fetchUserDetails = useCallback(async () => {
    // This now checks the actual token in storage to be safe
    if (localStorage.getItem('authToken')) {
      try {
        const response = await api.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Auth token is invalid, logging out.", error);
        logout(); // Make sure to define logout before it's used here
      }
    }
  }, []); // Removed dependency on logout to prevent loops

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (token) {
        setLoading(true);
        await fetchUserDetails();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, [token, fetchUserDetails]);

  const login = async (email, password) => {
    try {
      const response = await api.loginUser({ email, password });
      if (response?.data?.access) {
        const newToken = response.data.access;
        localStorage.setItem('authToken', newToken);
        setToken(newToken); // This triggers the useEffect to fetch user details
        const userProfileResponse = await api.getProfile();
        setUser(userProfileResponse.data);
        return userProfileResponse.data;
      } else {
        throw new Error("Login response did not include an access token.");
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = { token, user, isAuthenticated: !!user, loading, login, logout, fetchUserDetails };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};