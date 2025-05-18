import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import HospitalManagementSystem from './components/HospitalManagementSystem';
import Dashboard from './components/dashboard/Dashboard';
import StaffManagement from './components/StaffManagement';
import PatientManagement from './components/PatientManagement';
import MedicationManagement from './components/MedicationManagement';
import ReportManagement from './components/ReportManagement';
import ResourceManagement from './components/ResourceManagement';
import StaffRota from './components/StaffRota';
import UnauthorizedPage from './components/auth/UnauthorizedPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HospitalManagementSystem />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                <Route
                  path="staff"
                  element={
                    <ProtectedRoute requiredPermissions={['manage_staff']}>
                      <StaffManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="patients"
                  element={
                    <ProtectedRoute requiredPermissions={['manage_patients', 'view_patients']}>
                      <PatientManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="medications"
                  element={
                    <ProtectedRoute requiredPermissions={['manage_resources']}>
                      <MedicationManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute requiredPermissions={['view_reports']}>
                      <ReportManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="resources"
                  element={
                    <ProtectedRoute requiredPermissions={['manage_resources']}>
                      <ResourceManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="rota"
                  element={
                    <ProtectedRoute requiredPermissions={['manage_staff']}>
                      <StaffRota />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 