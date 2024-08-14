const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = '123';

    res.json({ token, 'role': user.role, 'username': user.name , 'classroom': user.classroom});
  } catch (error) {
    console.error('Login error:', error); 
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
