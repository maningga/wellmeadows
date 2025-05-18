import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock as LockIcon } from '@mui/icons-material';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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
            }}
          >
            <LockIcon
              color="error"
              sx={{ fontSize: 64, mb: 2 }}
            />
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{ color: 'error.main', fontWeight: 600 }}
            >
              Access Denied
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              paragraph
            >
              You don't have permission to access this page.
              Please contact your administrator if you believe this is an error.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default UnauthorizedPage; 