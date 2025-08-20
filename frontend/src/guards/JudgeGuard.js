import React from "react";
import { Navigate } from "react-router-dom";

const JudgeGuard = ({ children }) => {
  const storedJudge = localStorage.getItem("judge");
  const judge = storedJudge ? JSON.parse(storedJudge) : null;

  if (!judge) {
    return <Navigate to="/login/judge" replace />;
  }

  return children;
};

export default JudgeGuard;
