import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;