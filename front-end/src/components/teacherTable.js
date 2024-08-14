import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, InputAdornment, Button, TablePagination } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';



const TeacherTable = () => {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const username = localStorage.getItem('username') || ''; 
    const role = localStorage.getItem('role') || '';
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        fetchTeachers();

        setModalOpen(false);
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('/studium/users/view_by_role/Teacher');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };


    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        teacher.phone.toString().includes(searchTerm.trim().toLowerCase()) ||
        teacher.age.toString().includes(searchTerm.trim().toLowerCase()) ||
        teacher.gender.toLowerCase().includes(searchTerm.trim().toLowerCase()) 
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditOpen = (user) => {
        setEditUser(user);
        setEditModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setEditUser({});
        fetchTeachers();
        setEditModalOpen(false);
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete the user?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels the confirmation
        }
        try {
            await axios.delete(`/studium/users/delete_user/${id}`);
            fetchTeachers();
        } catch (err) {
            alert("Failed to delete the user. Please try again.")
        }
    };
 
    return (
        <Box sx={{ padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: '25px',
                        marginRight: '20px',
                        backgroundColor: '#87CEFA',
                        color: 'black',
                        '&:hover': {
                            color: 'white',
                        },
                    }}
                    onClick={handleOpenModal}
                >
                    Create User
                </Button>

                <TextField
                    variant="outlined"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        borderRadius: '50px',
                        width: '300px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            paddingRight: 0,
                            height: '40px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: '50px',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchTerm('')}>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: '#87CEFA'}}>
                            <TableCell sx = {{textAlign: 'center'}}>Name</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Email</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Contact No</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Age</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Gender</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Role</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Classroom</TableCell>
                            <TableCell sx = {{textAlign: 'center'}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTeachers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((teacher) => (
                                <TableRow key={teacher._id}>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.name}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.email}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.phone}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.age}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.gender}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.role}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>{teacher.classroom ? teacher.classroom.name : 'N/A'}</TableCell>
                                    <TableCell sx = {{textAlign: 'center'}}>
                                        <IconButton sx={{ '&:hover': { color: 'blue' } }} onClick={ () => {handleEditOpen(teacher)}}>
                                            <DriveFileRenameOutlineIcon />
                                        </IconButton>
                                        <IconButton sx={{ '&:hover': { color: 'red' } }}   onClick={() => {handleDelete(teacher._id)}}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredTeachers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10]}
                />
            </TableContainer>

            <CreateUserModal 
            open={modalOpen} 
            onClose={handleCloseModal} 
            roletype = {role}
            />
            

            <EditUserModal 
            open={editModalOpen} 
            onClose={handleCloseEditModal} 
            user = {editUser}
            />

        </Box>
    );
};

export default TeacherTable;
