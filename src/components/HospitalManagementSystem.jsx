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
  Button,
  Container,
  Fade,
  ListItemIcon,
  alpha,
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
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { SearchProvider, useSearch } from '../context/SearchContext';
import SearchModal from './search/SearchModal';

const SearchButton = () => {
  const { openSearch } = useSearch();
  return (
    <Box sx={{ mr: 2 }}>
      <Tooltip title="Search">
        <IconButton
          color="inherit"
          onClick={openSearch}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

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
      text: 'Patient Management', 
      icon: <PatientIcon />, 
      path: '/patients',
      permission: ['manage_patients', 'view_patients'],
      subItems: [
        { text: 'All Patients', path: '/patients' },
        { text: 'Inpatients', path: '/patients/inpatients' },
        { text: 'Outpatients', path: '/patients/outpatients' },
        { text: 'Appointments', path: '/patients/appointments' },
        { text: 'Next of Kin', path: '/patients/next-of-kin' },
        { text: 'Patient Medication', path: '/patients/medication' },
      ]
    },
    { 
      text: 'Staff Management', 
      icon: <PeopleIcon />, 
      path: '/staff',
      permission: 'manage_staff',
      subItems: [
        { text: 'All Staff', path: '/staff' },
        { text: 'Qualifications', path: '/staff/qualifications' },
        { text: 'Work Experience', path: '/staff/experience' },
        { text: 'Staff Rota', path: '/staff/rota' },
      ]
    },
    { 
      text: 'Ward Management', 
      icon: <LocalHospital />, 
      path: '/wards',
      permission: 'manage_wards',
      subItems: [
        { text: 'All Wards', path: '/wards' },
        { text: 'Bed Allocation', path: '/wards/beds' },
        { text: 'Ward Supplies', path: '/wards/supplies' },
      ]
    },
    { 
      text: 'Inventory', 
      icon: <ResourceIcon />, 
      path: '/inventory',
      permission: 'manage_inventory',
      subItems: [
        { text: 'Drugs', path: '/inventory/drugs' },
        { text: 'Supplies', path: '/inventory/supplies' },
        { text: 'Suppliers', path: '/inventory/suppliers' },
        { text: 'Requisitions', path: '/inventory/requisitions' },
      ]
    },
    { 
      text: 'Local Doctors', 
      icon: <PersonIcon />, 
      path: '/doctors',
      permission: 'manage_doctors'
    },
    { 
      text: 'Reports', 
      icon: <ReportIcon />, 
      path: '/reports',
      permission: 'view_reports',
      subItems: [
        { text: 'Patient Reports', path: '/reports/patients' },
        { text: 'Staff Reports', path: '/reports/staff' },
        { text: 'Inventory Reports', path: '/reports/inventory' },
        { text: 'Ward Reports', path: '/reports/wards' },
      ]
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
    <SearchProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <LocalHospital sx={{ 
                  mr: 1,
                  transition: 'all 0.3s ease',
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
                    fontWeight: 600,
                    letterSpacing: '0.5px',
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
                  transition: 'all 0.3s ease',
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
                    fontSize: '1.25rem',
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
                        borderRadius: '8px',
                        padding: '8px 16px',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: '0%',
                          height: '2px',
                          backgroundColor: 'white',
                          transform: 'translateX(-50%)',
                          transition: 'width 0.3s ease',
                          opacity: location.pathname === item.path ? 1 : 0,
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                          '&::after': {
                            width: '80%',
                            opacity: 1,
                          },
                        },
                        '&.active': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          '&::after': {
                            width: '80%',
                            opacity: 1,
                          },
                        },
                      }}
                      startIcon={item.icon}
                    >
                      {item.text}
                    </Button>
                  )
                ))}
              </Box>

              {/* Search Button */}
              <SearchButton />

              {/* User Profile Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'all 0.3s ease',
                ml: 2,
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 2, 
                    display: { xs: 'none', sm: 'block' },
                    color: '#e3f2fd',
                    fontWeight: 500,
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
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
              minWidth: 200,
            }
          }}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
        >
          {menuItems.map((item) => (
            checkPermission(item.permission) && (
              <React.Fragment key={item.text}>
                <MenuItem
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
                {item.subItems?.map((subItem) => (
                  <MenuItem
                    key={subItem.text}
                    onClick={() => handleNavigate(subItem.path)}
                    selected={location.pathname === subItem.path}
                    sx={{
                      pl: 4,
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
                    <Typography variant="body2">{subItem.text}</Typography>
                  </MenuItem>
                ))}
              </React.Fragment>
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

        {/* Search Modal */}
        <SearchModal />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 8, md: 10 },
            minHeight: '100vh',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%),
                radial-gradient(circle at 100% 0%, rgba(33, 150, 243, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 0% 100%, rgba(25, 118, 210, 0.08) 0%, transparent 50%),
                repeating-linear-gradient(45deg, rgba(33, 150, 243, 0.03) 0px, rgba(33, 150, 243, 0.03) 1px, transparent 1px, transparent 10px),
                repeating-linear-gradient(-45deg, rgba(25, 118, 210, 0.03) 0px, rgba(25, 118, 210, 0.03) 1px, transparent 1px, transparent 10px)
              `,
              backgroundAttachment: 'fixed',
              zIndex: 0,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
              backdropFilter: 'blur(100px)',
              zIndex: 1,
            },
          }}
        >
          <Fade in={true} timeout={800}>
            <Box sx={{ 
              position: 'relative',
              zIndex: 2,
              p: 3,
              '& > *': {
                transition: 'all 0.3s ease',
              },
              '& .MuiPaper-root': {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                },
              },
              '& .MuiCard-root': {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                },
              },
            }}>
              <Outlet />
            </Box>
          </Fade>
        </Box>
      </Box>
    </SearchProvider>
  );
};

export default HospitalManagementSystem; 