import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext'; // <-- IMPORT
import { CustomThemeProvider } from './context/ThemeContext'; // <-- IMPORT

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider> {/* <-- ADD LANGUAGE PROVIDER */}
          <CustomThemeProvider> {/* <-- ADD THEME PROVIDER */}
            <App />
          </CustomThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);