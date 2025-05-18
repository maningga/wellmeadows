import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
} from '@mui/material';
import {
  LocalHospital,
  People,
  Hotel,
  Timeline,
  Assignment,
  MedicalServices,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  TrendingUp,
  TrendingDown,
  AccessTime,
  EventAvailable,
  Group,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hospitalStats, setHospitalStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const { user } = useAuth();

  const generateMockData = () => {
    return {
      bedOccupancy: Math.floor(Math.random() * 30) + 60, // 60-90%
      totalPatients: Math.floor(Math.random() * 50) + 100, // 100-150
      availableDoctors: Math.floor(Math.random() * 10) + 10, // 10-20
      availableNurses: Math.floor(Math.random() * 20) + 35, // 35-55
      pendingAppointments: Math.floor(Math.random() * 15) + 20, // 20-35
      medicationAlerts: Math.floor(Math.random() * 8) + 1, // 1-8
      emergencyWaitTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      surgeriesToday: Math.floor(Math.random() * 8) + 5, // 5-13
      availableBeds: Math.floor(Math.random() * 20) + 30, // 30-50
      staffOnDuty: Math.floor(Math.random() * 15) + 25, // 25-40
      departmentStats: [
        { name: 'Emergency', patients: Math.floor(Math.random() * 20) + 10 },
        { name: 'ICU', patients: Math.floor(Math.random() * 10) + 5 },
        { name: 'Pediatrics', patients: Math.floor(Math.random() * 15) + 8 },
        { name: 'Surgery', patients: Math.floor(Math.random() * 12) + 6 },
      ],
    };
  };

  const generateRecentActivities = () => {
    const activities = [
      { type: 'admission', message: 'New patient admitted to Emergency', time: '2 minutes ago', icon: <LocalHospital color="primary" /> },
      { type: 'discharge', message: 'Patient discharged from ICU', time: '15 minutes ago', icon: <EventAvailable color="success" /> },
      { type: 'emergency', message: 'Emergency case arrived - Code Blue', time: '30 minutes ago', icon: <NotificationsIcon color="error" /> },
      { type: 'staff', message: 'Dr. Smith started their shift', time: '1 hour ago', icon: <Group color="info" /> },
      { type: 'medication', message: 'Medication inventory updated', time: '2 hours ago', icon: <MedicalServices color="warning" /> },
    ];
    return activities;
  };

  const fetchData = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setHospitalStats(generateMockData());
      setRecentActivities(generateRecentActivities());
      setRefreshing(false);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon, color, delay, trend, subtitle }) => (
    <Grow in={!loading} timeout={500 + delay}>
      <Card 
        sx={{ 
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `linear-gradient(45deg, transparent, ${color}22)`,
            borderRadius: '0 0 0 100%',
          }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          <Fade in={!refreshing}>
            <Box>
              <Typography variant="h4" component="div" color={color} sx={{ mb: 1 }}>
                {refreshing ? <CircularProgress size={24} /> : value}
              </Typography>
              {subtitle && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {trend === 'up' ? (
                    <TrendingUp fontSize="small" color="success" />
                  ) : (
                    <TrendingDown fontSize="small" color="error" />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        </CardContent>
      </Card>
    </Grow>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Message */}
        <Grid item xs={12}>
          <Fade in={true} timeout={800}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1))',
                  borderRadius: '0 0 0 100%',
                }}
              />
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.username}!
              </Typography>
              <Typography variant="subtitle1">
                Here's what's happening in the hospital today
              </Typography>
            </Paper>
          </Fade>
        </Grid>

        {/* Key Statistics */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Patients"
            value={hospitalStats.totalPatients}
            icon={<LocalHospital />}
            color="#1976d2"
            delay={0}
            trend="up"
            subtitle="12% increase"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Available Staff"
            value={hospitalStats.staffOnDuty}
            icon={<People />}
            color="#2e7d32"
            delay={200}
            trend="up"
            subtitle="Active now"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Available Beds"
            value={hospitalStats.availableBeds}
            icon={<Hotel />}
            color="#ed6c02"
            delay={400}
            trend="down"
            subtitle="5 reserved"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Wait Time"
            value={hospitalStats.emergencyWaitTime + ' min'}
            icon={<AccessTime />}
            color="#9c27b0"
            delay={600}
            trend="down"
            subtitle="Improving"
          />
        </Grid>

        {/* Department Statistics */}
        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={1000}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Department Status</Typography>
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchData} disabled={refreshing}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {hospitalStats.departmentStats.map((dept, index) => (
                  <Grid item xs={12} sm={6} key={dept.name}>
                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {dept.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(dept.patients / 30) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            flexGrow: 1,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: dept.patients > 25 ? 'error.main' : 'primary.main',
                            },
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {dept.patients} patients
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={1000}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateX(10px)',
                        backgroundColor: 'action.hover',
                      },
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Fade>
        </Grid>

        {/* Additional Statistics */}
        <Grid item xs={12}>
          <Grow in={true} timeout={1200}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Today's Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assignment color="primary" sx={{ mr: 1 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">
                        Pending Appointments
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(hospitalStats.pendingAppointments / 50) * 100}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {hospitalStats.pendingAppointments}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalServices color="error" sx={{ mr: 1 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">
                        Medication Alerts
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(hospitalStats.medicationAlerts / 10) * 100}
                        color="error"
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {hospitalStats.medicationAlerts}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip
                        icon={<EventAvailable />}
                        label={`${hospitalStats.surgeriesToday} Surgeries Today`}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<Group />}
                        label={`${hospitalStats.availableDoctors} Doctors Available`}
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip
                        icon={<LocalHospital />}
                        label="Emergency Room: Active"
                        color="error"
                        variant="outlined"
                      />
                      <Chip
                        icon={<MedicalServices />}
                        label={`${hospitalStats.availableNurses} Nurses On Duty`}
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grow>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 