import React, { useState, useEffect } from 'react';
import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Typography, Grid, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';



const CreateClassroomModal = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const [schedule, setSchedule] = useState([{ day: '', startTime: '', endTime: '' }]);
    const [teacher, setTeacher] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [freeTeachers, setFreeTeachers] = useState([]);
    const [freeStudents, setFreeStudents] = useState([]);

    const fetchFreeTeachers = async () => {
        try {
            const response = await axios.get('https://studium-cyan.vercel.app/studium/users/view_free_teachers');
            setFreeTeachers(response.data);
        } catch (error) {
            console.error('Error fetching free teachers:', error);
        }
    };
    useEffect(() => {
        
        fetchFreeTeachers();
    }, []);


    const fetchFreeStudents = async () => {
        try {
            const response = await axios.get('https://studium-cyan.vercel.app/studium/users/view_free_students');
            setFreeStudents(response.data);
        } catch (error) {
            console.error('Error fetching free students:', error);
        }
    };
    useEffect(() => {
        fetchFreeStudents();
    }, []);

    const handleAddDay = () => {
        setSchedule([...schedule, { day: '', startTime: '', endTime: '' }]);
    };

    const handleRemoveDay = (index) => {
        const updatedSchedule = [...schedule];
        updatedSchedule.splice(index, 1);
        setSchedule(updatedSchedule);
    };

    const handleDayChange = (index, field, value) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[index][field] = value;
        setSchedule(updatedSchedule);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        

        if (!name || schedule.some(day => !day.day || !day.startTime || !day.endTime) || !teacher) {
            setError('Please fill in all required fields.');
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to submit the form?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels the confirmation
        }

        try {
            await axios.post('https://studium-cyan.vercel.app/studium/classrooms/create_classroom', {
                name,
                schedule,
                teacher,
                students
            });
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleCloseModal = () => {
        setName('');
        setSchedule([{ day: '', startTime: '', endTime: '' }]);
        setTeacher('');
        setStudents([]);
        setError('');
        fetchFreeTeachers();
        fetchFreeStudents();
        onClose(); // Close the modal
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '16px', // Round edges
                    width: '60%'
                },
            }} >
            <DialogTitle sx={{ background: '#87CEFA' }}>
                <Typography sx={{ textAlign: 'center', fontSize: '20px' }}>Create New Classroom</Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCloseModal}
                    style={{ position: 'absolute', right: 25, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '40px' }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Classroom Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {schedule.map((daySchedule, index) => (
                        <Grid container spacing={2} key={index} alignItems="center">
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={3}>
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
                            <Grid item xs={12} sm={3}>
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
                                            marginTop: '20px', // Adjust this value to lower the button as needed
                                        }}
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Box>



                            </Grid>
                        </Grid>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={handleAddDay}
                            sx={{ mt: 2, borderRadius: '20px' }}
                        >
                            Add Another Day
                        </Button>
                    </Box>




                    <FormControl fullWidth variant="standard" margin="dense">
                        <InputLabel>Teacher</InputLabel>
                        <Select
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value)}
                            label="Teacher"
                            required
                        >
                            {freeTeachers.map(teacher => (
                                <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Autocomplete
                        multiple
                        options={freeStudents}
                        getOptionLabel={(option) => option.name}
                        value={students}
                        onChange={(e, newValue) => setStudents(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Students"
                                margin="dense"
                                fullWidth
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                    />

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </DialogContent>
            <DialogActions sx={{ paddingBottom: '40px', paddingRight: '40px', paddingLeft: '40px' }}>
                <Button
                    onClick={handleCloseModal}
                    sx={{
                        borderRadius: '20px', // Round the button
                        padding: '8px 16px',  // Add some padding for better appearance
                    }}
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        borderRadius: '20px', // Round the button
                        padding: '8px 16px',  // Add some padding for better appearance
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateClassroomModal;
