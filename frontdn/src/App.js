import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLoginPage from "./pages/adminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FormEditPage from "./pages/FormEditPage";

//frontdn/src/App.js

// Simple auth check: does a token exist in localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Dashboard page (private) */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
        
        
        {/* Form edit page (private) */}
        <Route path="/forms/:id/edit" element={<FormEditPage />} />

      </Routes>
    </Router>
  );
}

export default App;
