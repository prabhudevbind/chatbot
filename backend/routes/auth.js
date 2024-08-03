// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile=require('../models/StudentProfile');
const router = express.Router();

// JWT secret key
const JWT_SECRET = 'dev980';

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ loginStatus: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ loginStatus: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ loginStatus: true, token });
  } catch (error) {
    res.status(500).json({ loginStatus: false, message: 'Server error' });
  }
});

router.post('/student/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
      const user = await StudentProfile.findOne({ email });
      if (!user) {
        return res.status(401).json({ loginStatus: false, message: 'Invalid email or password' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ loginStatus: false, message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ loginStatus: true, token });
    } catch (error) {
        console.log(error);
      res.status(500).json({ loginStatus: false, message: 'Server error' });
    }
  });

// Middleware to protect routes
const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ loginStatus: false, message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ loginStatus: false, message: 'Forbidden' });
      }
      next();
    } catch (error) {
      res.status(401).json({ loginStatus: false, message: 'Invalid token' });
    }
  };
};

module.exports = router;
// module.exports.auth = auth;
