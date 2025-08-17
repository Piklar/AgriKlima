// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts and Route Protection
import PublicHeader from './components/Header'; // Renamed from Header
import Footer from './components/Footer';
import LoggedInLayout from './components/LoggedInLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AboutUsPage from './pages/AboutUsPage';
import NewsPage from './pages/NewsPage';

// --- Logged-In User Pages ---
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // Create this
import WeatherPage from './pages/WeatherPage'; // Create this
import CropsPage from './pages/CropsPage';     // Create this
import PestsPage from './pages/PestsPage';     // Create this
import CalendarPage from './pages/CalendarPage'; // Create this

// Public Layout Component
const PublicLayout = ({ children }) => (
  <>
    <PublicHeader />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      {/* Standalone pages without any layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* --- Public Routes with Public Layout --- */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      
      {/* --- Protected Routes with Logged-In Layout --- */}
      {/* Note: The Dashboard is now the "Home" for logged-in users */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><LoggedInLayout><DashboardPage /></LoggedInLayout></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute><LoggedInLayout><ProfilePage /></LoggedInLayout></ProtectedRoute>} 
      />
      <Route 
        path="/weather" 
        element={<ProtectedRoute><LoggedInLayout><WeatherPage /></LoggedInLayout></ProtectedRoute>} 
      />
      <Route 
        path="/crops" 
        element={<ProtectedRoute><LoggedInLayout><CropsPage /></LoggedInLayout></ProtectedRoute>} 
      />
       <Route 
        path="/pests" 
        element={<ProtectedRoute><LoggedInLayout><PestsPage /></LoggedInLayout></ProtectedRoute>} 
      />
       <Route 
        path="/calendar" 
        element={<ProtectedRoute><LoggedInLayout><CalendarPage /></LoggedInLayout></ProtectedRoute>} 
      />

      {/* --- Shared Routes (will show different navbar based on auth state) --- */}
      {/* For simplicity, we create them inside the protected area. 
          You can create separate public versions if needed. */}
      <Route 
        path="/about" 
        element={<ProtectedRoute><LoggedInLayout><AboutUsPage /></LoggedInLayout></ProtectedRoute>} 
      />
      <Route 
        path="/news" 
        element={<ProtectedRoute><LoggedInLayout><NewsPage /></LoggedInLayout></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;