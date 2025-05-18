import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // In a real app, this would be an API call
      // Simulating API call
      const mockUsers = {
        'medical_director': {
          password: 'director123',
          permissions: ['manage_staff', 'manage_patients', 'view_patients', 'view_reports', 'manage_resources']
        },
        'personnel_officer': {
          password: 'officer123',
          permissions: ['manage_staff', 'view_reports']
        },
        'charge_nurse': {
          password: 'nurse123',
          permissions: ['manage_patients', 'view_patients', 'view_reports', 'manage_resources']
        },
        'doctor': {
          password: 'doctor123',
          permissions: ['manage_patients', 'view_patients', 'view_reports']
        },
        'nurse': {
          password: 'nurse123',
          permissions: ['view_patients', 'update_patient_status']
        }
      };

      const mockUser = mockUsers[credentials.role];
      if (!mockUser || mockUser.password !== credentials.password) {
        throw new Error('Invalid credentials');
      }

      const userData = {
        username: credentials.username,
        role: credentials.role,
        permissions: mockUser.permissions,
        token: 'mock-jwt-token-' + Math.random()
      };

      // Store authentication data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 