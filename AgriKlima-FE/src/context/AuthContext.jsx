// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (token) {
        try {
          const response = await api.getProfile();
          // --- FIX: We now expect the user object directly in `response.data` ---
          if (response && response.data) {
            setUser(response.data); // The entire response.data is the user
          } else {
            throw new Error("Invalid profile response format");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrapAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.loginUser({ email, password });
      if (response && response.data && response.data.access) {
        const newToken = response.data.access;
        localStorage.setItem('authToken', newToken);
        setToken(newToken); // This will trigger the useEffect to fetch the profile
        return true; 
      } else {
        throw new Error("Login response did not include an access token.");
      }
    } catch (error) {
      logout();
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