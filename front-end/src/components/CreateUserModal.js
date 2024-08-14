// CreateUserModal.js
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const CreateUserModal = ({ open, onClose, roletype }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [role, setRole] = useState('');
    const [classroom, setClassroom] = useState('');
    const [assignedBy, setAssignedBy] = useState('');
    const [error, setError] = useState('');
    const classroomid = localStorage.getItem('classroom' || '');


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name || !email || !password || !retypePassword || !role || !age || !gender) {
            setError('Please fill in all required fields.');
            return;
        }

        if (password !== retypePassword) {
            setError('Passwords do not match');
            return;
        }

        if (age < 1){
            setError('Age cannot be lesser than 1.');
            return;
        }

        if (age > 100){
            setError('Age cannot be greater than 100.');
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to submit the form?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels the confirmation
        }

        try {
            await axios.post('https://studium-cyan.vercel.app/studium/users/create_new_user', {
                name,
                email,
                phone,
                password,
                age,
                gender,
                role,
                classroom : classroomid === 'null'? null: classroomid
            });
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleCloseModal = () => {
        setName('');
        setEmail('');
        setPhone('');
        setGender('');
        setAge('');
        setPassword('');
        setRetypePassword('');
        setRole('');
        setClassroom('');
        setAssignedBy('');
        setError('');
        onClose(); // Close the modal
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '16px', // Round edges
                },
            }} >
            <DialogTitle sx={{ background: '#87CEFA' }}>
                <Typography sx={{ textAlign: 'center' , fontSize: '20px'}} >Create New User</Typography>
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
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                     <TextField
                        margin="dense"
                        label="Age"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: 0, max: 100 }}

                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                    <FormControl fullWidth variant="standard" margin="dense">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            label="Gender"
                            required
                        >
                                <MenuItem key="male" value="Male">Male</MenuItem>,
                                <MenuItem key="female" value="Female">Female</MenuItem>,
                                <MenuItem key="other" value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <TextField
                        margin="dense"
                        label="Retype Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        required
                    />
                    <FormControl fullWidth variant="standard" margin="dense">
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Role"
                            required
                        >
                            {roletype === "Principal" && [
                                <MenuItem key="teacher" value="Teacher">Teacher</MenuItem>,
                                <MenuItem key="student" value="Student">Student</MenuItem>
                            ]}
                            {roletype === "Teacher" && (
                                <MenuItem key="student" value="Student">Student</MenuItem>
                            )}
                        </Select>
                    </FormControl>


                    {/* Add fields for classroom and assignedBy if needed */}
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

export default CreateUserModal;
