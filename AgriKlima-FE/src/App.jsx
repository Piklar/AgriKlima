// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewsPage from './pages/NewsPage';
import AboutUsPage from './pages/AboutUsPage';
import SignUpPage from './pages/SignUpPage'; // <-- IMPORT THE NEW PAGE

// Layout component to wrap pages with Header and Footer
const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} /> {/* <-- ADD THE SIGNUP ROUTE */}

      {/* Routes with the main layout */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/news" element={<MainLayout><NewsPage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutUsPage /></MainLayout>} />
    </Routes>
  );
}

export default App;