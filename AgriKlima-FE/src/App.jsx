// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts and Route Protection
import PublicHeader from './components/Header';
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
import ProfilePage from './pages/ProfilePage';
import WeatherPage from './pages/WeatherPage';
import CropsPage from './pages/CropsPage';
import PestsPage from './pages/PestsPage';
import CalendarPage from './pages/CalendarPage';

// --- Admin Panel Imports ---
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import ManageCrops from './pages/Admin/ManageCrops';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageNews from './pages/Admin/ManageNews';
import ManagePests from './pages/Admin/ManagePests';
import ManageTasks from './pages/Admin/ManageTasks';
import ManageWeather from './pages/Admin/ManageWeather';

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
      <Route 
        path="/about" 
        element={<ProtectedRoute><LoggedInLayout><AboutUsPage /></LoggedInLayout></ProtectedRoute>} 
      />
      <Route 
        path="/news" 
        element={<ProtectedRoute><LoggedInLayout><NewsPage /></LoggedInLayout></ProtectedRoute>} 
      />

      {/* --- ADMIN PANEL ROUTES --- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="crops" element={<ManageCrops />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="pests" element={<ManagePests />} />
          <Route path="tasks" element={<ManageTasks />} />
          <Route path="weather" element={<ManageWeather />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;