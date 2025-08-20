import React from "react";
import { Navigate } from "react-router-dom";

const HomeGuard = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default HomeGuard;
