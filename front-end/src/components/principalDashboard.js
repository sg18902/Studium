import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import TeacherTable from './teacherTable';
import StudentTable from './studentTable';
import ClassroomTable from './classroomTable';

const PrincipalDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('teachers'); 
  const username = localStorage.getItem('username') || ''; 
  const role = localStorage.getItem('role') || '';
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'teachers':
        return <TeacherTable />;
      case 'students':
        return <StudentTable />;
      case 'classroom':
        return <ClassroomTable />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ background: '#353935' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hello, {username}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => setSelectedComponent('teachers')}>
              Teachers
            </Button>
            <Button color="inherit" onClick={() => setSelectedComponent('students')}>
              Students
            </Button>
            <Button color="inherit" onClick={() => setSelectedComponent('classroom')}>
              Classroom
            </Button>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        {/* <Typography variant="h4">Principal Dashboard</Typography> */}
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default PrincipalDashboard;
