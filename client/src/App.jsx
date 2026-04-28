import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VisitorRegistration from './pages/VisitorRegistration';
import AdminDashboard from './pages/AdminDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PassView from './pages/PassView';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app-container">
      {user && <Sidebar />}
      <main className={user ? "main-content-with-sidebar" : "main-content-full"}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/visitor-register" element={<VisitorRegistration />} />
          <Route path="/pass/:id" element={<PassView />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['security', 'admin']} />}>
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/security/logs" element={<SecurityDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']} />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/invites" element={<EmployeeDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
