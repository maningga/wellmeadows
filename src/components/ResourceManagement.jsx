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
  Box,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ResourceManagement = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      name: 'MRI Machine',
      category: 'Equipment',
      location: 'Radiology',
      status: 'Operational',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
    },
    {
      id: 2,
      name: 'Hospital Beds',
      category: 'Furniture',
      location: 'Ward A',
      status: 'In Use',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-05-01',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    status: '',
    lastMaintenance: '',
    nextMaintenance: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingResource(null);
    setFormData({
      name: '',
      category: '',
      location: '',
      status: '',
      lastMaintenance: '',
      nextMaintenance: '',
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
    if (editingResource) {
      setResources((prev) =>
        prev.map((item) =>
          item.id === editingResource.id ? { ...formData, id: item.id } : item
        )
      );
      toast.success('Resource updated successfully!');
    } else {
      setResources((prev) => [
        ...prev,
        { ...formData, id: Math.max(...prev.map((r) => r.id)) + 1 },
      ]);
      toast.success('Resource added successfully!');
    }
    handleClose();
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData(resource);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setResources((prev) => prev.filter((item) => item.id !== id));
    toast.success('Resource removed successfully!');
  };

  const getMaintenanceStatus = (nextMaintenance) => {
    const today = new Date();
    const maintenance = new Date(nextMaintenance);
    const diffDays = Math.ceil((maintenance - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <Alert severity="error">Maintenance Overdue</Alert>;
    } else if (diffDays <= 30) {
      return <Alert severity="warning">Maintenance Due Soon</Alert>;
    }
    return <Alert severity="success">Maintenance Up to Date</Alert>;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Resource Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        Add New Resource
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Maintenance</TableCell>
              <TableCell>Next Maintenance</TableCell>
              <TableCell>Maintenance Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.name}</TableCell>
                <TableCell>{resource.category}</TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>{resource.lastMaintenance}</TableCell>
                <TableCell>{resource.nextMaintenance}</TableCell>
                <TableCell>
                  {getMaintenanceStatus(resource.nextMaintenance)}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(resource)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(resource.id)}
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
          {editingResource ? 'Edit Resource' : 'Add New Resource'}
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              label="Category"
            >
              <MenuItem value="Equipment">Equipment</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Supplies">Supplies</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={formData.location}
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
              <MenuItem value="Operational">Operational</MenuItem>
              <MenuItem value="In Use">In Use</MenuItem>
              <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
              <MenuItem value="Out of Service">Out of Service</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="lastMaintenance"
            label="Last Maintenance Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.lastMaintenance}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="nextMaintenance"
            label="Next Maintenance Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.nextMaintenance}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingResource ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResourceManagement; 