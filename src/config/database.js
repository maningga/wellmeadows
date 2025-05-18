import axios from 'axios';

// Database Configuration
const DB_CONFIG = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL,
    timeout: 10000,
  },
};

// Get current environment configuration
const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return DB_CONFIG[env];
};

// Create axios instance with configuration
const dbClient = axios.create({
  baseURL: getConfig().apiUrl,
  timeout: getConfig().timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
dbClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
dbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          window.location.href = '/unauthorized';
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Database service functions
const DatabaseService = {
  // Patient related queries
  patients: {
    getAll: () => dbClient.get('/patients'),
    getById: (id) => dbClient.get(`/patients/${id}`),
    create: (data) => dbClient.post('/patients', data),
    update: (id, data) => dbClient.put(`/patients/${id}`, data),
    delete: (id) => dbClient.delete(`/patients/${id}`),
    getAppointments: (id) => dbClient.get(`/patients/${id}/appointments`),
  },

  // Staff related queries
  staff: {
    getAll: () => dbClient.get('/staff'),
    getById: (id) => dbClient.get(`/staff/${id}`),
    create: (data) => dbClient.post('/staff', data),
    update: (id, data) => dbClient.put(`/staff/${id}`, data),
    delete: (id) => dbClient.delete(`/staff/${id}`),
    getSchedule: (id) => dbClient.get(`/staff/${id}/schedule`),
  },

  // Medication related queries
  medications: {
    getAll: () => dbClient.get('/medications'),
    getById: (id) => dbClient.get(`/medications/${id}`),
    create: (data) => dbClient.post('/medications', data),
    update: (id, data) => dbClient.put(`/medications/${id}`, data),
    delete: (id) => dbClient.delete(`/medications/${id}`),
    getInventory: () => dbClient.get('/medications/inventory'),
  },

  // Resource management queries
  resources: {
    getAll: () => dbClient.get('/resources'),
    getById: (id) => dbClient.get(`/resources/${id}`),
    create: (data) => dbClient.post('/resources', data),
    update: (id, data) => dbClient.put(`/resources/${id}`, data),
    delete: (id) => dbClient.delete(`/resources/${id}`),
    checkAvailability: (id) => dbClient.get(`/resources/${id}/availability`),
  },

  // Reports related queries
  reports: {
    getStaffStats: () => dbClient.get('/reports/staff'),
    getWardStats: () => dbClient.get('/reports/ward'),
    getMedicationStats: () => dbClient.get('/reports/medication'),
    getSupplyStats: () => dbClient.get('/reports/supply'),
    getBedStats: () => dbClient.get('/reports/bed'),
    getAnalyticsStats: () => dbClient.get('/reports/analytics'),
  },

  // Authentication related queries
  auth: {
    login: (credentials) => dbClient.post('/auth/login', credentials),
    logout: () => dbClient.post('/auth/logout'),
    refreshToken: () => dbClient.post('/auth/refresh-token'),
    verifyToken: () => dbClient.get('/auth/verify'),
  },
};

export default DatabaseService; 