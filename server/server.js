const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors'); 


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // for parsing application/json

// CORS Configuration
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  app.use(cors(corsOptions)); 

// Routes
app.use('/studium/users', require('./routes/userRoutes'));
app.use('/studium/classrooms', require('./routes/classroomRoutes'));
app.use('/studium/timetables', require('./routes/timetableRoutes'));
app.use('/studium/auth', require('./routes/authRoutes')); // Add this line

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
