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
  Alert,
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
  Medication as MedicationIcon,
  Assessment as ReportIcon,
  Inventory as ResourceIcon,
  Schedule as RotaIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    patients: { total: 0, inpatient: 0, outpatient: 0 },
    staff: { total: 0, doctors: 0, nurses: 0 },
    wards: { total: 0, occupied: 0 },
    appointments: { today: 0, upcoming: 0 },
    inventory: { lowStock: 0, totalItems: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
        setAlerts(data.alerts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? 4 : 1,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '12px',
              p: 1,
              mr: 2,
            }}
          >
            {React.cloneElement(icon, { sx: { color: color, fontSize: 28 } })}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }) => (
    <ListItem sx={{ py: 1 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        {activity.icon}
      </ListItemIcon>
      <ListItemText
        primary={activity.title}
        secondary={activity.time}
        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
        secondaryTypographyProps={{ variant: 'caption' }}
      />
    </ListItem>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Welcome back, {user?.username}
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.patients.total}
            icon={<LocalHospital />}
            color={theme.palette.primary.main}
            onClick={() => navigate('/patients')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Staff Members"
            value={stats.staff.total}
            icon={<People />}
            color={theme.palette.success.main}
            onClick={() => navigate('/staff')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Wards"
            value={stats.wards.total}
            icon={<LocalHospital />}
            color={theme.palette.info.main}
            onClick={() => navigate('/wards')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Appointments"
            value={stats.appointments.today}
            icon={<EventIcon />}
            color={theme.palette.warning.main}
            onClick={() => navigate('/patients/appointments')}
          />
        </Grid>
      </Grid>

      {/* Alerts and Activity */}
      <Grid container spacing={3}>
        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Alerts
            </Typography>
            {alerts.length > 0 ? (
              <List>
                {alerts.map((alert, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.message}
                        secondary={alert.time}
                      />
                    </ListItem>
                    {index < alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No alerts at this time
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            {recentActivity.length > 0 ? (
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ActivityItem activity={activity} />
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 