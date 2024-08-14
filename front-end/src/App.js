// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrincipalDashboard from './components/principalDashboard';
import StudentDashboard from './components/studentDashboard';
import TeacherDashboard from './components/teacherDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher_dashboard" element={<TeacherDashboard />} />
        <Route path="/student_dashboard" element={<StudentDashboard />} />
        <Route path="/principal_dashboard" element={<PrincipalDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
