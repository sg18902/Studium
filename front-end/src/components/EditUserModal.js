// CreateUserModal.js
import React, { useState , useEffect} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const EditUserModal = ({ open, onClose, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && open) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAge(user.age || '');
            setGender(user.gender || '');
        }
    }, [user]); 


    
    const handleSubmit = async (e) => {
       
        e.preventDefault();
        

        if (!name || !email || !phone || !age || !gender) {
            setError('Please fill in all required fields.');
            return;
        }

        if (age < 1) {
            setError('Age cannot be lesser than 1.');
            return;
        }

        if (age > 100) {
            setError('Age cannot be greater than 100.');
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to submit the form?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels the confirmation
        }

        try {
            await axios.put(`/studium/users/update_user/${user?._id}`, {
                name,
                email,
                phone,
                age,
                gender
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
        setAge('');
        setGender('');
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
                <Typography sx={{ textAlign: 'center', fontSize: '20px' }} >Edit User</Typography>
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

export default EditUserModal;
