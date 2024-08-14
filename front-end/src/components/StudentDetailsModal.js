import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const StudentDetailsModal = ({ open, onClose, students }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '80%', maxWidth: '800px', backgroundColor: 'white', padding: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Student Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#87CEFA' }}>
                <TableCell sx={{ textAlign: 'center' }}>Name</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Email</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Contact No</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Age</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow key={student._id}>
                    <TableCell sx={{ textAlign: 'center' }}>{student.name}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{student.email}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{student.phone}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{student.age}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{student.gender}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={students.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10]}
          />
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default StudentDetailsModal;
