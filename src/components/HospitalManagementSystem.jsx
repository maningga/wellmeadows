import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Tabs,
  Tab,
  Button,
  Container,
  Fade,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  LocalHospital as PatientIcon,
  Medication as MedicationIcon,
  Assessment as ReportIcon,
  Inventory as ResourceIcon,
  Schedule as RotaIcon,
  AccountCircle,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  LocalHospital,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const HospitalManagementSystem = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard',
      permission: null 
    },
    { 
      text: 'Staff Management', 
      icon: <PeopleIcon />, 
      path: '/staff',
      permission: 'manage_staff'
    },
    { 
      text: 'Patient Management', 
      icon: <PatientIcon />, 
      path: '/patients',
      permission: ['manage_patients', 'view_patients']
    },
    { 
      text: 'Medication Management', 
      icon: <MedicationIcon />, 
      path: '/medications',
      permission: 'manage_resources'
    },
    { 
      text: 'Reports', 
      icon: <ReportIcon />, 
      path: '/reports',
      permission: 'view_reports'
    },
    { 
      text: 'Resource Management', 
      icon: <ResourceIcon />, 
      path: '/resources',
      permission: 'manage_resources'
    },
    { 
      text: 'Staff Rota', 
      icon: <RotaIcon />, 
      path: '/rota',
      permission: 'manage_staff'
    },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Check if user has permission for a menu item
  const checkPermission = (permission) => {
    if (!permission) return true;
    if (Array.isArray(permission)) {
      return permission.some(p => hasPermission(p));
    }
    return hasPermission(permission);
  };

  const getCurrentTabValue = () => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => item.path === currentPath);
    return index >= 0 ? index : 0;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
          transition: 'background 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and Title for Mobile */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleMobileMenuOpen}
                sx={{ 
                  mr: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <LocalHospital sx={{ 
                mr: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }} />
              <Typography 
                variant="h6" 
                noWrap 
                component="div"
                sx={{
                  background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Well Meadows
              </Typography>
            </Box>

            {/* Logo and Title for Desktop */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              mr: 4,
              transition: 'all 0.3s ease'
            }}>
              <LocalHospital sx={{ 
                mr: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                WELL MEADOWS HOSPITAL
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
              {menuItems.map((item) => (
                checkPermission(item.permission) && (
                  <Button
                    key={item.text}
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      color: 'white',
                      mx: 1,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'white',
                        transform: location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 0.3s ease',
                        opacity: location.pathname === item.path ? 1 : 0,
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover::after': {
                        transform: 'scaleX(1)',
                        opacity: 1,
                      },
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                )
              ))}
            </Box>

            {/* User Profile Section */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mr: 2, 
                  display: { xs: 'none', sm: 'block' },
                  color: '#e3f2fd'
                }}
              >
                {user?.username}
              </Typography>
              <Tooltip 
                title="Account settings"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ 
                    ml: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                  aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.dark',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    }
                  }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
        sx={{ 
          mt: 5,
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        {menuItems.map((item) => (
          checkPermission(item.permission) && (
            <MenuItem
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
                {item.icon}
                <Typography sx={{ ml: 1 }}>{item.text}</Typography>
              </Box>
            </MenuItem>
          )
        ))}
      </Menu>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            mt: 1.5,
          }
        }}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <MenuItem disabled sx={{ opacity: 0.8 }}>
          <Typography variant="body2" color="textSecondary">
            Role: {user?.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
              color: 'error.main',
              transform: 'translateX(4px)',
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ 
              transition: 'color 0.2s ease',
              '&:hover': {
                color: 'error.main',
              }
            }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          transition: 'all 0.3s ease',
        }}
      >
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            p: 3,
            '& > *': {
              transition: 'all 0.3s ease',
            }
          }}>
            <Outlet />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default HospitalManagementSystem; 