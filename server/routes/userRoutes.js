const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');


// Get all users
router.get('/view_all', async (req, res) => {
  try {
    const users = await User.find().populate('classroom');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
router.post('/create_new_user', async (req, res) => {
    const { name, email, phone, age, gender, password, role, classroom, assignedBy } = req.body;
  
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with the hashed password
      const user = new User({
        name,
        email,
        password: hashedPassword, // Use the hashed password here
        phone,
        age,
        gender,
        role,
        classroom,
        assignedBy
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


// Update user details
router.put('/update_user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true, // returns the updated document
        });
        res.json(updatedUser);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

// Delete a user
router.delete('/delete_user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

router.get('/view_by_classroom/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const users = await User.find({classroom: id, role: 'Student'}).populate('classroom');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users by role
router.get('/view_by_role/:role', async (req, res) => {
  const { role } = req.params;

  if (!['Principal', 'Teacher', 'Student'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    const users = await User.find({ role }).populate('classroom');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/view_free_teachers', async (req, res) => {
  try {
    const teachers = await User.find({ classroom: null, role: 'Teacher' });
    res.status(200).json(teachers); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/view_free_students', async (req, res) => {
  try {
    const students = await User.find({ classroom: null, role: 'Student' });
    res.status(200).json(students); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
