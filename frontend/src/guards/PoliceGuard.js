import React from "react";
import { Navigate } from "react-router-dom";

const PoliceGuard = ({ children }) => {
  const storedPolice = localStorage.getItem("police");
  const police = storedPolice ? JSON.parse(storedPolice) : null;

  if (!police) {
    return <Navigate to="/login/police" replace />;
  }

  return children;
};

export default PoliceGuard;
