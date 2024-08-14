import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Container, Paper, Box, IconButton, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://studium-cyan.vercel.app/studium/auth/login', {
        email,
        password,
      });


      if (response.status === 200) {
        alert('Login successful');

        const { token , role, username, classroom} = response.data;
        console.log(token);
        console.log(role);
        console.log(username);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('classroom', classroom)

        if(role === 'Principal'){
          navigate('/principal_dashboard')
        } else if (role === 'Teacher') {
          navigate('/teacher_dashboard');
        } else if (role === 'Student') {
          navigate('/student_dashboard')
        }

        // navigate('/dashboard');
      } else {
        alert('Login unsuccessful');
      }
    } catch (err) {
      alert('Login unsuccessful');
    }
  };

  return (
    <div
      style={{
        color: '#ffffff',
        background: 'linear-gradient(180deg, #333333 0%, #000000 100%)',
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '97vh',
        }}
      >
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ fontSize: 60 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
          </Box>


          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '20px' }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root.Mui-required': { color: 'red' },
                  '& .MuiInputLabel-root': {
                    '&.MuiInputLabel-shrink': {
                      color: 'black',
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root.Mui-required': { color: 'red' },
                  '& .MuiInputLabel-root': {
                    '&.MuiInputLabel-shrink': {
                      color: 'black',
                    },
                  },
                }}
              />
              <Box sx={{ padding: '20px' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<LoginIcon />}
                  sx = {{borderRadius: '25px', background: '#007FFF'}}
                >
                  Login
                </Button>
              </Box>

              
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
