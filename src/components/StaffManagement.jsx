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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const StaffManagement = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. John Smith', role: 'Doctor', department: 'Cardiology', contact: '123-456-7890' },
    { id: 2, name: 'Nurse Sarah Johnson', role: 'Nurse', department: 'Emergency', contact: '123-456-7891' },
  ]);

  const [open, setOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    contact: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStaff(null);
    setFormData({ name: '', role: '', department: '', contact: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (editingStaff) {
      setStaff((prev) =>
        prev.map((item) =>
          item.id === editingStaff.id ? { ...formData, id: item.id } : item
        )
      );
      toast.success('Staff member updated successfully!');
    } else {
      setStaff((prev) => [
        ...prev,
        { ...formData, id: Math.max(...prev.map((s) => s.id)) + 1 },
      ]);
      toast.success('Staff member added successfully!');
    }
    handleClose();
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData(staffMember);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setStaff((prev) => prev.filter((item) => item.id !== id));
    toast.success('Staff member removed successfully!');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Staff Management
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        Add New Staff
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((staffMember) => (
              <TableRow key={staffMember.id}>
                <TableCell>{staffMember.name}</TableCell>
                <TableCell>{staffMember.role}</TableCell>
                <TableCell>{staffMember.department}</TableCell>
                <TableCell>{staffMember.contact}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(staffMember)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(staffMember.id)}
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
          {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
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
            name="role"
            label="Role"
            type="text"
            fullWidth
            value={formData.role}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="department"
            label="Department"
            type="text"
            fullWidth
            value={formData.department}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="contact"
            label="Contact"
            type="text"
            fullWidth
            value={formData.contact}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingStaff ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffManagement; 