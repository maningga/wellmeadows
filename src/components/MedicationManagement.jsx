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

const MedicationManagement = () => {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Amoxicillin',
      type: 'Antibiotic',
      quantity: 500,
      unit: 'tablets',
      expiryDate: '2024-12-31',
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Ibuprofen',
      type: 'Pain Reliever',
      quantity: 1000,
      unit: 'tablets',
      expiryDate: '2024-06-30',
      status: 'Low Stock',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    status: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMedication(null);
    setFormData({
      name: '',
      type: '',
      quantity: '',
      unit: '',
      expiryDate: '',
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
    if (editingMedication) {
      setMedications((prev) =>
        prev.map((item) =>
          item.id === editingMedication.id ? { ...formData, id: item.id } : item
        )
      );
      toast.success('Medication updated successfully!');
    } else {
      setMedications((prev) => [
        ...prev,
        { ...formData, id: Math.max(...prev.map((m) => m.id)) + 1 },
      ]);
      toast.success('Medication added successfully!');
    }
    handleClose();
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setFormData(medication);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setMedications((prev) => prev.filter((item) => item.id !== id));
    toast.success('Medication removed successfully!');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Medication Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        Add New Medication
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>{medication.name}</TableCell>
                <TableCell>{medication.type}</TableCell>
                <TableCell>{medication.quantity}</TableCell>
                <TableCell>{medication.unit}</TableCell>
                <TableCell>{medication.expiryDate}</TableCell>
                <TableCell>{medication.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(medication)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(medication.id)}
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
          {editingMedication ? 'Edit Medication' : 'Add New Medication'}
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
            name="type"
            label="Type"
            type="text"
            fullWidth
            value={formData.type}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="unit"
            label="Unit"
            type="text"
            fullWidth
            value={formData.unit}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="expiryDate"
            label="Expiry Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.expiryDate}
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
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingMedication ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicationManagement; 