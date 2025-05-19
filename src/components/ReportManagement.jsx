import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Assessment,
  People,
  LocalHospital,
  Medication,
  Inventory,
  Hotel,
  GetApp,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { db } from '../config/database';

const ReportManagement = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const reports = [
    {
      title: 'Staff Allocation Report',
      description: 'View and analyze staff distribution across departments',
      icon: <People fontSize="large" />,
      type: 'staff',
      columns: [
        { id: 'staff_number', label: 'Staff ID' },
        { id: 'first_name', label: 'First Name' },
        { id: 'last_name', label: 'Last Name' },
        { id: 'position', label: 'Position' },
        { id: 'ward_name', label: 'Ward' },
      ],
    },
    {
      title: 'Patient Ward Assignments',
      description: 'Current patient distribution in hospital wards',
      icon: <LocalHospital fontSize="large" />,
      type: 'ward',
      columns: [
        { id: 'ward_name', label: 'Ward' },
        { id: 'total_beds', label: 'Total Beds' },
        { id: 'occupied_beds', label: 'Occupied' },
        { id: 'available_beds', label: 'Available' },
      ],
    },
    {
      title: 'Medication Usage Report',
      description: 'Track medication consumption and inventory levels',
      icon: <Medication fontSize="large" />,
      type: 'medication',
      columns: [
        { id: 'name', label: 'Medication' },
        { id: 'quantity_in_stock', label: 'In Stock' },
        { id: 'times_prescribed', label: 'Times Prescribed' },
        { id: 'total_units_prescribed', label: 'Total Units Used' },
      ],
    },
    {
      title: 'Supply Inventory Status',
      description: 'Current status of medical supplies and equipment',
      icon: <Inventory fontSize="large" />,
      type: 'supply',
      columns: [
        { id: 'name', label: 'Item' },
        { id: 'supply_type', label: 'Type' },
        { id: 'quantity_in_stock', label: 'In Stock' },
        { id: 'reorder_level', label: 'Reorder Level' },
        { id: 'needs_reorder', label: 'Needs Reorder' },
      ],
    },
    {
      title: 'Bed Occupancy Report',
      description: 'Real-time bed availability and occupancy rates',
      icon: <Hotel fontSize="large" />,
      type: 'bed',
      columns: [
        { id: 'ward_name', label: 'Ward' },
        { id: 'total_beds', label: 'Total Beds' },
        { id: 'occupied_beds', label: 'Occupied' },
        { id: 'available_beds', label: 'Available' },
        { id: 'occupancy_rate', label: 'Occupancy Rate %' },
      ],
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive hospital performance metrics',
      icon: <Assessment fontSize="large" />,
      type: 'analytics',
      columns: [], // Analytics has a custom view
    },
  ];

  const generateReport = async (type) => {
    setLoading(true);
    try {
      const response = await db.query(`/reports/${type}`);
      setReportData(response);
      setCurrentReport(reports.find(r => r.type === type));
      setOpenDialog(true);
    } catch (error) {
      toast.error(`Error generating ${type} report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReportData(null);
    setCurrentReport(null);
  };

  const downloadReport = () => {
    if (!reportData) return;

    const csv = generateCSV(reportData, currentReport.columns);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (data, columns) => {
    if (!Array.isArray(data)) return '';
    
    const header = columns.map(col => col.label).join(',');
    const rows = data.map(row => 
      columns.map(col => `"${row[col.id] || ''}"`)
        .join(',')
    );
    
    return [header, ...rows].join('\n');
  };

  const renderAnalytics = (data) => {
    if (!data) return null;

    return (
      <Box>
        <Typography variant="h6" gutterBottom>Patient Statistics</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(data.patientStats[0] || {}).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Typography>
                <Typography variant="h4">{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom>Staff Distribution</Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.staffStats.map((row) => (
                <TableRow key={row.position}>
                  <TableCell>{row.position}</TableCell>
                  <TableCell align="right">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom>Ward Occupancy</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ward</TableCell>
                <TableCell align="right">Total Beds</TableCell>
                <TableCell align="right">Occupied</TableCell>
                <TableCell align="right">Occupancy Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.wardOccupancy.map((row) => (
                <TableRow key={row.ward_name}>
                  <TableCell>{row.ward_name}</TableCell>
                  <TableCell align="right">{row.total_beds}</TableCell>
                  <TableCell align="right">{row.occupied_beds}</TableCell>
                  <TableCell align="right">{row.occupancy_rate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
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
                  onClick={() => generateReport(report.type)}
                  startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
                  disabled={loading}
                >
                  Generate Report
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {currentReport?.title}
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={downloadReport}
              disabled={!reportData}
            >
              Download CSV
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : currentReport?.type === 'analytics' ? (
            renderAnalytics(reportData)
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {currentReport?.columns.map((column) => (
                      <TableCell key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(reportData) && reportData.map((row, index) => (
                    <TableRow key={index}>
                      {currentReport?.columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === 'needs_reorder' 
                            ? (row[column.id] ? 'Yes' : 'No')
                            : row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportManagement; 