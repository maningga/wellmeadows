import React, { useState } from 'react';
import {
  Container,
  Typography,
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
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const PatientManagement = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      age: 45,
      gender: 'Female',
      condition: 'Hypertension',
      ward: 'Cardiology',
      status: 'Admitted',
    },
    {
      id: 2,
      name: 'John Brown',
      age: 32,
      gender: 'Male',
      condition: 'Fracture',
      ward: 'Orthopedics',
      status: 'Outpatient',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    condition: '',
    ward: '',
    status: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      age: '',
      gender: '',
      condition: '',
      ward: '',
      status: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (editingPatient) {
      setPatients((prev) =>
        prev.map((item) =>
          item.id === editingPatient.id ? { ...formData, id: item.id } : item
        )
      );
      toast.success('Patient record updated successfully!');
    } else {
      setPatients((prev) => [
        ...prev,
        { ...formData, id: Math.max(...prev.map((p) => p.id)) + 1 },
      ]);
      toast.success('Patient added successfully!');
    }
    handleClose();
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setPatients((prev) => prev.filter((item) => item.id !== id));
    toast.success('Patient record removed successfully!');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patient Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        Add New Patient
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Ward</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.ward}</TableCell>
                <TableCell>{patient.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(patient)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(patient.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingPatient ? 'Edit Patient Record' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Age"
            type="number"
            fullWidth
            value={formData.age}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
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
            name="condition"
            label="Medical Condition"
            type="text"
            fullWidth
            value={formData.condition}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="ward"
            label="Ward"
            type="text"
            fullWidth
            value={formData.ward}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="Admitted">Admitted</MenuItem>
              <MenuItem value="Outpatient">Outpatient</MenuItem>
              <MenuItem value="Discharged">Discharged</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingPatient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientManagement; 