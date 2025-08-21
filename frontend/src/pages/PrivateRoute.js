// src/pages/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, redirectTo = '/adminlogin' }) => {
  const token = localStorage.getItem('token');

  // If no token, redirect immediately
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  // If token exists, render the child component
  return children;
};

export default PrivateRoute;
