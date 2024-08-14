import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, InputAdornment, Button, TablePagination } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CreateClassroomModal from './CreateClassroomModal';
import StudentDetailsModal from './StudentDetailsModal';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PrincipalTimetableEdit from './PrincipalTimetableEdit';



const ClassroomTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [classroomid, setClassroomid] = useState('');

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/studium/classrooms/view_all_classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  useEffect(() => {
    
    fetchClassrooms();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchClassrooms();

    setModalOpen(false);
  };

  const handleEditOpen = (classroomid) => {
    setEditModalOpen(true);
    setClassroomid(classroomid);
    console.log('Handling edit open for classroom:', classroomid);
  };

  const handleEditClose = () => {
    fetchClassrooms();

    setEditModalOpen(false);
  }

  const handleDelete = (id) => {
    console.log('Handling delete for classroom ID:', id);
  };

  const handleOpenStudentModal = (classroom) => {
    setSelectedClassroom(classroom);
    setStudentModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setStudentModalOpen(false);
    fetchClassrooms();

    setSelectedClassroom(null);
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

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
          Create Classroom
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
            <TableRow sx={{ background: '#87CEFA' }}>
              <TableCell sx={{ textAlign: 'center' }}>Name</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Schedule</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Teacher</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Number of Students</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClassrooms
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((classroom) => (
                <TableRow key={classroom._id}>
                  <TableCell sx={{ textAlign: 'center' }}>{classroom.name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {classroom.schedule.map((sched, index) => (
                      <div key={index}>
                        {sched.day}: {sched.startTime} - {sched.endTime}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {classroom.teacher ? classroom.teacher.name : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography
                      sx={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleOpenStudentModal(classroom)}
                    >
                      {classroom.students.length}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton sx={{ '&:hover': { color: 'blue' } }} onClick={() => handleEditOpen(classroom._id)}>
                      <EditCalendarIcon />
                    </IconButton>
                    
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <PrincipalTimetableEdit
          open = {editModalOpen}
          onClose={handleEditClose}
          classroomid={classroomid}
          />
        </Table>
        <TablePagination
          component="div"
          count={filteredClassrooms.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
        />
      </TableContainer>

      <CreateClassroomModal open={modalOpen} onClose={handleCloseModal} />

      {selectedClassroom && (
        <StudentDetailsModal
          open={studentModalOpen}
          onClose={handleCloseStudentModal}
          students={selectedClassroom.students}
        />
      )}
    </Box>
  );
};

export default ClassroomTable;
