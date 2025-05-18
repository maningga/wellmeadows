import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Badge,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { value: 'medical_director', label: 'Medical Director', icon: <Badge />, password: 'director123' },
    { value: 'personnel_officer', label: 'Personnel Officer', icon: <Badge />, password: 'officer123' },
    { value: 'charge_nurse', label: 'Charge Nurse', icon: <Badge />, password: 'nurse123' },
    { value: 'doctor', label: 'Doctor', icon: <Badge />, password: 'doctor123' },
    { value: 'nurse', label: 'Nurse', icon: <Badge />, password: 'nurse123' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      // For demo purposes, show the correct password
      const selectedRole = roles.find(r => r.value === formData.role);
      if (selectedRole) {
        setError(`Invalid credentials. For demo, use password: ${selectedRole.password}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grow in={true} timeout={800}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                Hospital Management System
              </Typography>
              <Typography
                component="h2"
                variant="h5"
                gutterBottom
                sx={{ color: 'text.secondary', mb: 3 }}
              >
                Login
              </Typography>

              {error && (
                <Grow in={!!error}>
                  <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {error}
                  </Alert>
                </Grow>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleInputChange}
                    required
                    sx={{
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem
                        key={role.value}
                        value={role.value}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {role.icon}
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </Paper>
          </Grow>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login; 