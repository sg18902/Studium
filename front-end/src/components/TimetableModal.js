import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Button,
    Alert,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios'; // Import axios for making HTTP requests




const TimetableModal = ({ open, onClose, classroom }) => {
    const [schedule, setSchedule] = useState([{ subject: '', day: '', startTime: '', endTime: '' }]);
    const [error, setError] = useState('');

    const handleDayChange = (index, key, value) => {
        const newSchedule = [...schedule];
        newSchedule[index][key] = value;
        setSchedule(newSchedule);
    };

    const handleRemoveDay = (index) => {
        const newSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(newSchedule);
    };

    const handleAddDay = () => {
        setSchedule([...schedule, { subject: '', day: '', startTime: '', endTime: '' }]);
    };

    const handleSubmit = async () => {
        setError('');

        // Validation for schedule range
        for (let entry of schedule) {
            if (entry.endTime <= entry.startTime) {
                setError(`End time must be greater than start time for ${entry.subject} on ${entry.day}`);
                return;
            }
            const classroomDay = classroom.schedule.find(day => day.day === entry.day);
            if (!classroomDay) {
                setError(`Schedule for ${entry.day} is out of the classroom's scheduled days.`);
                return;
            }
            if (entry.startTime < classroomDay.startTime || entry.endTime > classroomDay.endTime) {
                setError(`Schedule for ${entry.subject} on ${entry.day} is out of the classroom's time range.`);
                return;
            }
        }

        // Validation for overlapping schedules
        for (let i = 0; i < schedule.length; i++) {
            for (let j = i + 1; j < schedule.length; j++) {
                if (
                    schedule[i].day === schedule[j].day &&
                    ((schedule[i].startTime < schedule[j].endTime && schedule[i].startTime >= schedule[j].startTime) ||
                        (schedule[j].startTime < schedule[i].endTime && schedule[j].startTime >= schedule[i].startTime))
                ) {
                    setError(`Schedules for ${schedule[i].subject} and ${schedule[j].subject} on ${schedule[i].day} overlap.`);
                    return;
                }
            }
        }

        const payload = {
            classroom: classroom._id, // Assuming `classroom` is an object with `_id` field
            subject: schedule[0].subject, // Use the first subject for now, or adjust according to your needs
            schedule
          };
          const isConfirmed = window.confirm("Are you sure you want to submit the form?");
          if (!isConfirmed) {
              return; // Exit the function if the user cancels the confirmation
          }
        
          try {
            // Make API request to save the timetable
            await axios.post('/studium/timetables/create_time_table', payload);
            console.log('Timetable saved successfully');
            onClose(); // Close the modal
          } catch (error) {
            setError(error.response?.data?.message || 'Failed to save timetable');
          }
        
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '60%', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Create Timetable
                </Typography>

                {schedule.map((daySchedule, index) => (
                    <Grid container spacing={2} key={index} alignItems="center">
                        <Grid item xs={12} sm={3}>
                            <TextField
                                margin="dense"
                                label="Subject"
                                fullWidth
                                variant="standard"
                                value={daySchedule.subject}
                                onChange={(e) => handleDayChange(index, 'subject', e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth variant="standard" margin="dense">
                                <InputLabel>Day</InputLabel>
                                <Select
                                    value={daySchedule.day}
                                    onChange={(e) => handleDayChange(index, 'day', e.target.value)}
                                    label="Day"
                                    required
                                >
                                    <MenuItem value="Monday">Monday</MenuItem>
                                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                                    <MenuItem value="Thursday">Thursday</MenuItem>
                                    <MenuItem value="Friday">Friday</MenuItem>
                                    <MenuItem value="Saturday">Saturday</MenuItem>
                                    <MenuItem value="Sunday">Sunday</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                margin="dense"
                                label="Start Time"
                                type="time"
                                fullWidth
                                variant="standard"
                                value={daySchedule.startTime}
                                onChange={(e) => handleDayChange(index, 'startTime', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                margin="dense"
                                label="End Time"
                                type="time"
                                fullWidth
                                variant="standard"
                                value={daySchedule.endTime}
                                onChange={(e) => handleDayChange(index, 'endTime', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                        </Grid>
                        {schedule.length > 1 && (
                            <Grid item xs={12} sm={2}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleRemoveDay(index)}
                                        sx={{
                                            color: 'red',
                                            marginTop: '20px',
                                        }}
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                ))}

                {error && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <Box sx={{ mt: 4 }}>
                    <Button onClick={handleAddDay} variant="outlined" color="primary" sx={{ mr: 2 }}>
                        Add Another Subject
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Submit Timetable
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TimetableModal;
