import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';

const StaffRota = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shifts = ['Morning', 'Afternoon', 'Night'];

  const [schedule, setSchedule] = useState({
    Monday: {
      Morning: ['Dr. Smith', 'Nurse Johnson'],
      Afternoon: ['Dr. Brown', 'Nurse Williams'],
      Night: ['Dr. Davis', 'Nurse Miller'],
    },
    Tuesday: {
      Morning: ['Dr. Wilson', 'Nurse Anderson'],
      Afternoon: ['Dr. Taylor', 'Nurse Thomas'],
      Night: ['Dr. Moore', 'Nurse Jackson'],
    },
    // Add initial schedules for other days...
  });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: '',
    shift: '',
    staff: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      day: '',
      shift: '',
      staff: '',
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
    const { day, shift, staff } = formData;
    if (day && shift && staff) {
      setSchedule((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [shift]: [...(prev[day]?.[shift] || []), staff],
        },
      }));
      toast.success('Staff schedule added successfully!');
      handleClose();
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const removeStaff = (day, shift, staffMember) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shift]: prev[day][shift].filter((staff) => staff !== staffMember),
      },
    }));
    toast.success('Staff member removed from schedule');
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Staff Rota
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ mb: 3 }}
          >
            Add Staff to Schedule
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day/Shift</TableCell>
                  {shifts.map((shift) => (
                    <TableCell key={shift}>{shift}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {daysOfWeek.map((day) => (
                  <TableRow key={day}>
                    <TableCell component="th" scope="row">
                      {day}
                    </TableCell>
                    {shifts.map((shift) => (
                      <TableCell key={`${day}-${shift}`}>
                        {schedule[day]?.[shift]?.map((staff, index) => (
                          <div key={`${staff}-${index}`}>
                            {staff}
                            <Button
                              size="small"
                              color="error"
                              onClick={() => removeStaff(day, shift, staff)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Staff to Schedule</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Day</InputLabel>
            <Select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              label="Day"
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Shift</InputLabel>
            <Select
              name="shift"
              value={formData.shift}
              onChange={handleInputChange}
              label="Shift"
            >
              {shifts.map((shift) => (
                <MenuItem key={shift} value={shift}>
                  {shift}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="staff"
            label="Staff Name"
            type="text"
            fullWidth
            value={formData.staff}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Add to Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffRota; 