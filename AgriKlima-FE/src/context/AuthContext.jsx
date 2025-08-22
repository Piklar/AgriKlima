// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api'; // Use your new api service

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (token) {
        try {
          // On initial load, verify token and get user profile
          const response = await api.getProfile(token);
          setUser(response.data.user);
        } catch (error) {
          // If token is invalid/expired, clear it
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrapAuth();
  }, [token]);

  // --- THIS IS THE IMPROVED LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      // 1. Get the token from the API
      const loginResponse = await api.loginUser({ email, password });
      if (loginResponse.data.access) {
        const newToken = loginResponse.data.access;
        localStorage.setItem('authToken', newToken);
        
        // 2. Immediately use the new token to get the user's profile
        const profileResponse = await api.getProfile(newToken);
        const loggedInUser = profileResponse.data.user;

        // 3. Set the state
        setUser(loggedInUser);
        setToken(newToken);
        
        // 4. Return the user object so the LoginPage can use it for redirection
        return loggedInUser; 
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Throw the error so the LoginPage can catch it
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, isAuthenticated: !!token, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};