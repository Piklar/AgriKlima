// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// --- LAYOUTS ---
import PublicLayout from './components/PublicLayout';
import SharedLayout from './components/SharedLayout';
import LoggedInLayout from './components/LoggedInLayout';
import AdminLayout from './pages/Admin/AdminLayout';

// --- PAGE IMPORTS ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AboutUsPage from './pages/AboutUsPage';
import NewsPage from './pages/NewsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import WeatherPage from './pages/WeatherPage';
import CropsPage from './pages/CropsPage';
import PestsPage from './pages/PestsPage';
import CalendarPage from './pages/CalendarPage';

// --- ADMIN PAGES ---
import ManageCrops from './pages/Admin/ManageCrops';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageNews from './pages/Admin/ManageNews';
import ManagePests from './pages/Admin/ManagePests';
import ManageTasks from './pages/Admin/ManageTasks';
import ManageWeather from './pages/Admin/ManageWeather';

// --- CONFIG ---
const DEBUG_MODE = false; // Set true for debugging (disable route guards)

function App() {
  return (
    <Routes>
      {/* --- STANDALONE ROUTES --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* --- PUBLIC ROUTE --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* --- SHARED ROUTES --- */}
      <Route element={<SharedLayout />}>
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/news" element={<NewsPage />} />
      </Route>

      {/* --- USER ROUTES --- */}
      {DEBUG_MODE ? (
        // --- DEBUGGING MODE: guards disabled ---
        <Route element={<LoggedInLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/pests" element={<PestsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Route>
      ) : (
        // --- PRODUCTION MODE: ProtectedRoute applied ---
        <Route element={<ProtectedRoute />}>
          <Route element={<LoggedInLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/crops" element={<CropsPage />} />
            <Route path="/pests" element={<PestsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Route>
      )}

      {/* --- ADMIN ROUTES --- */}
      {DEBUG_MODE ? (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="crops" element={<ManageCrops />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="pests" element={<ManagePests />} />
          <Route path="tasks" element={<ManageTasks />} />
          <Route path="weather" element={<ManageWeather />} />
        </Route>
      ) : (
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
      )}

      {/* --- FALLBACK 404 --- */}
      <Route path="*" element={<div><h2>404 Page Not Found</h2></div>} />
    </Routes>
  );
}

export default App;
