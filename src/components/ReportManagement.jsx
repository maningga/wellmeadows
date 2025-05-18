import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import {
  Assessment,
  People,
  LocalHospital,
  Medication,
  Inventory,
  Hotel,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ReportManagement = () => {
  const reports = [
    {
      title: 'Staff Allocation Report',
      description: 'View and analyze staff distribution across departments',
      icon: <People fontSize="large" />,
      action: () => generateReport('staff'),
    },
    {
      title: 'Patient Ward Assignments',
      description: 'Current patient distribution in hospital wards',
      icon: <LocalHospital fontSize="large" />,
      action: () => generateReport('ward'),
    },
    {
      title: 'Medication Usage Report',
      description: 'Track medication consumption and inventory levels',
      icon: <Medication fontSize="large" />,
      action: () => generateReport('medication'),
    },
    {
      title: 'Supply Inventory Status',
      description: 'Current status of medical supplies and equipment',
      icon: <Inventory fontSize="large" />,
      action: () => generateReport('supply'),
    },
    {
      title: 'Bed Occupancy Report',
      description: 'Real-time bed availability and occupancy rates',
      icon: <Hotel fontSize="large" />,
      action: () => generateReport('bed'),
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive hospital performance metrics',
      icon: <Assessment fontSize="large" />,
      action: () => generateReport('analytics'),
    },
  ];

  const generateReport = (type) => {
    // Simulate report generation
    toast.info('Generating report...');
    setTimeout(() => {
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`);
    }, 2000);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Report Management
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {report.icon}
                </Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  align="center"
                >
                  {report.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {report.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={report.action}
                  startIcon={<Assessment />}
                >
                  Generate Report
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReportManagement; 