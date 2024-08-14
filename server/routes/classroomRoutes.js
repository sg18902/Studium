const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroom');
const User = require('../models/user');

// Get all classrooms
router.get('/view_all_classrooms', async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('teacher').populate('students');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all classrooms
router.get('/get_classroom_by_id/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const classrooms = await Classroom.find({'_id': id}).populate('teacher').populate('students');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new classroom
router.post('/create_classroom', async (req, res) => {
  const { name, schedule, teacher, students } = req.body;
  const classroom = new Classroom({ name, schedule, teacher, students });

  try {
    // Save the new classroom
    const newClassroom = await classroom.save();

    // Update the classroom field for the teacher
    const updatedTeacher = await User.findByIdAndUpdate({_id: teacher}, { classroom: newClassroom._id }, { new: true });
    if (!updatedTeacher) {
      console.error('Teacher not found or update failed');
      return res.status(404).json({ message: 'Teacher not found' });
    }
    // Update the classroom field for each student
    const studentUpdates = students.map(student =>
      User.findByIdAndUpdate(student._id, { classroom: newClassroom._id })
    );
    await Promise.all(studentUpdates);

    res.status(201).json(newClassroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;
