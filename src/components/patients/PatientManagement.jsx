import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fade,
  Grow,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
  Backdrop,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  LocalHospital as AdmitIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useLocation, useSearchParams } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import SearchService from '../../services/SearchService';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PatientManagement = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('patient'); // 'patient' or 'appointment'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '123-456-7890',
      status: 'Admitted',
      ward: 'Cardiology',
      admissionDate: '2024-02-15',
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      department: 'Cardiology',
      doctor: 'Dr. Smith',
      date: '2024-02-20',
      time: '10:00',
      status: 'Scheduled',
    },
  ]);

  const [waitingList, setWaitingList] = useState([
    {
      id: 1,
      patientName: 'Jane Smith',
      priority: 'High',
      requestedDepartment: 'Emergency',
      dateAdded: '2024-02-15',
      estimatedWait: '2 hours',
    },
  ]);

  const [formData, setFormData] = useState({
    // Patient fields
    name: '',
    age: '',
    gender: '',
    contact: '',
    status: '',
    ward: '',
    admissionDate: '',
    // Appointment fields
    department: '',
    doctor: '',
    date: '',
    time: '',
    // Waiting list fields
    priority: '',
    requestedDepartment: '',
    estimatedWait: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update search when URL changes
    const searchFromUrl = searchParams.get('search');
    const filtersFromUrl = {};
    SearchService.getFilters('patients').forEach(filter => {
      const value = searchParams.get(filter);
      if (value) filtersFromUrl[filter] = value;
    });

    if (searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl || '');
      setPage(0);
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await SearchService.searchCategory('patients', searchTerm);
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
      showSnackbar('Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term, filters) => {
    setSearchTerm(term);
    setPage(0);

    // Update URL
    if (term) {
      searchParams.set('search', term);
    } else {
      searchParams.delete('search');
    }

    // Update filter params in URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });

    setSearchParams(searchParams);

    // Perform search
    try {
      const results = await SearchService.searchCategory('patients', term, filters);
      setPatients(results);
    } catch (error) {
      console.error('Search failed:', error);
      showSnackbar('Search failed', 'error');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData().finally(() => {
      setRefreshing(false);
      showSnackbar('Data refreshed successfully', 'success');
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      if (dialogType === 'patient') {
        setPatients((prev) => [...prev, { ...formData, id: prev.length + 1 }]);
        showSnackbar('Patient added successfully!');
      } else if (dialogType === 'appointment') {
        setAppointments((prev) => [...prev, { ...formData, id: prev.length + 1 }]);
        showSnackbar('Appointment scheduled successfully!');
      }
      handleCloseDialog();
      setLoading(false);
    }, 1000);
  };

  const handleAdmitPatient = (patientName) => {
    setLoading(true);
    setTimeout(() => {
      setWaitingList((prev) => prev.filter((item) => item.patientName !== patientName));
      showSnackbar(`${patientName} admitted successfully!`);
      setLoading(false);
    }, 1000);
  };

  if (loading && !refreshing) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const filterData = (data) => {
    if (!searchTerm) return data;
    
    return data.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        // Skip filtering on certain fields
        if (['id', 'createdAt', 'updatedAt'].includes(key)) return false;
        
        return value && 
               value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  const getStatusChip = (status) => {
    const colors = {
      Admitted: 'success',
      Scheduled: 'primary',
      'In Progress': 'warning',
      Completed: 'info',
      High: 'error',
      Medium: 'warning',
      Low: 'info',
    };

    return (
      <Chip
        label={status}
        color={colors[status] || 'default'}
        size="small"
        sx={{ minWidth: 80 }}
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Fade in={!loading}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                  <Tab label="Patients" />
                  <Tab label="Appointments" />
                  <Tab label="Waiting List" />
                </Tabs>
              </Box>

              {/* Search Bar */}
              <Box sx={{ p: 2 }}>
                <SearchBar
                  category="patients"
                  onSearch={handleSearch}
                  onRefresh={handleRefresh}
                  placeholder="Search patients..."
                  initialSearchTerm={searchTerm}
                />
              </Box>

              {/* Tabs Content */}
              <TabPanel value={tabValue} index={0}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Ward</TableCell>
                        <TableCell>Admission Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterData(patients)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((patient) => (
                          <Grow key={patient.id} in={true}>
                            <TableRow 
                              hover
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                  cursor: 'pointer',
                                },
                              }}
                            >
                              <TableCell>{patient.name}</TableCell>
                              <TableCell>{patient.age}</TableCell>
                              <TableCell>{patient.gender}</TableCell>
                              <TableCell>{patient.contact}</TableCell>
                              <TableCell>{getStatusChip(patient.status)}</TableCell>
                              <TableCell>{patient.ward}</TableCell>
                              <TableCell>{patient.admissionDate}</TableCell>
                              <TableCell>
                                <Tooltip title="Edit">
                                  <IconButton color="primary" size="small">
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton color="error" size="small">
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </Grow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filterData(patients).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </TabPanel>

              {/* Appointments Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Appointments</Typography>
                  <Button
                    variant="contained"
                    startIcon={<EventIcon />}
                    onClick={() => handleOpenDialog('appointment')}
                  >
                    Schedule Appointment
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.patientName}</TableCell>
                          <TableCell>{appointment.department}</TableCell>
                          <TableCell>{appointment.doctor}</TableCell>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.status}</TableCell>
                          <TableCell>
                            <IconButton color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Waiting List Tab */}
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Waiting List
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Date Added</TableCell>
                        <TableCell>Estimated Wait</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {waitingList.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.patientName}</TableCell>
                          <TableCell>{item.priority}</TableCell>
                          <TableCell>{item.requestedDepartment}</TableCell>
                          <TableCell>{item.dateAdded}</TableCell>
                          <TableCell>{item.estimatedWait}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<AdmitIcon />}
                              onClick={() => handleAdmitPatient(item.patientName)}
                            >
                              Admit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Fade>

      {/* Enhanced Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle>
          {dialogType === 'patient' ? 'Add New Patient' : 'Schedule Appointment'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'patient' ? (
            // Patient Form
            <>
              <TextField
                margin="dense"
                name="name"
                label="Patient Name"
                fullWidth
                value={formData.name || ''}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="age"
                label="Age"
                type="number"
                fullWidth
                value={formData.age || ''}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="contact"
                label="Contact Number"
                fullWidth
                value={formData.contact || ''}
                onChange={handleInputChange}
              />
            </>
          ) : (
            // Appointment Form
            <>
              <TextField
                margin="dense"
                name="patientName"
                label="Patient Name"
                fullWidth
                value={formData.patientName || ''}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  label="Department"
                >
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="doctor"
                label="Doctor"
                fullWidth
                value={formData.doctor || ''}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="date"
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date || ''}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="time"
                label="Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.time || ''}
                onChange={handleInputChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientManagement; 