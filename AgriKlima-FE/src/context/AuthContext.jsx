// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (token) {
        try {
          // On page load, verify the stored token and get the user's profile
          const response = await api.getProfile(); // Interceptor adds the token
          setUser(response.data);
        } catch (error) {
          console.error("Stored token is invalid:", error);
          // If the token is bad, clear everything
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
      // Step 1: Get the token from the backend
      const loginResponse = await api.loginUser({ email, password });
      
      if (loginResponse && loginResponse.data && loginResponse.data.access) {
        const newToken = loginResponse.data.access;
        localStorage.setItem('authToken', newToken);
        setToken(newToken); // This triggers the useEffect to run

        // Step 2: Immediately fetch the profile to get user data for redirection
        const profileResponse = await api.getProfile();
        const loggedInUser = profileResponse.data;
        setUser(loggedInUser);
        
        // Step 3: Return the user object so the LoginPage knows who logged in
        return loggedInUser; 
      } else {
        throw new Error("Login response did not include an access token.");
      }
    } catch (error) {
      logout(); // Clean up on any login failure
      throw error; // Re-throw the error for the LoginPage to display
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  // Provide the user object and a separate isAuthenticated flag for convenience
  const value = { token, user, isAuthenticated: !!user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};