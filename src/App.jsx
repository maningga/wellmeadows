import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HospitalManagementSystem from './components/HospitalManagementSystem';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/*" element={<HospitalManagementSystem />}>
            {/* Add your child routes here */}
            <Route path="dashboard" element={<div>Dashboard</div>} />
            <Route path="staff" element={<div>Staff Management</div>} />
            <Route path="patients" element={<div>Patient Management</div>} />
            <Route path="medications" element={<div>Medication Management</div>} />
            <Route path="reports" element={<div>Reports</div>} />
            <Route path="resources" element={<div>Resource Management</div>} />
            <Route path="rota" element={<div>Staff Rota</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 