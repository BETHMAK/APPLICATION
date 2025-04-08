import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token"); // Check token from sessionStorage
  if (!token) {
    return <Navigate to="/teacher" replace />;
  }
  return children;
};

export default ProtectedRoute;
