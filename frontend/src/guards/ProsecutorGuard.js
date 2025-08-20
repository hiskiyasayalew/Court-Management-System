import React from "react";
import { Navigate } from "react-router-dom";

const ProsecutorGuard = ({ children }) => {
  const storedProsecutor = localStorage.getItem("prosecutor");
  const prosecutor = storedProsecutor ? JSON.parse(storedProsecutor) : null;

  if (!prosecutor) {
    return <Navigate to="/login/prosecutor" replace />;
  }

  return children;
};

export default ProsecutorGuard;
