const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const StudentProfile = require('./models/StudentProfile');
const Attendance = require('./models/Attendance');
const Payment = require('./models/Payment');
var cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@devcoder980.64axway.mongodb.net/studentDashboard').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

// Create a new student profile
app.post('/students', upload.single('profilePicture'), async (req, res) => {
  try {
    const studentProfile = new StudentProfile({
      ...req.body,
      profilePicture: req.file ? `/${req.file.filename}` : undefined
    });
    await studentProfile.save();
    res.status(201).send(studentProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update student profile
app.patch('/students/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }
    const studentProfile = await StudentProfile.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!studentProfile) {
      return res.status(404).send();
    }
    res.status(200).send(studentProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update only student profile picture
app.patch('/students/:id/photo', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: 'Profile picture is required' });
    }
    const studentProfile = await StudentProfile.findByIdAndUpdate(req.params.id, {
      profilePicture: `/uploads/${req.file.filename}`
    }, { new: true, runValidators: true });
    if (!studentProfile) {
      return res.status(404).send();
    }
    res.status(200).send(studentProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add attendance record for a student
app.post('/students/:id/attendance', async (req, res) => {
  try {
    const attendance = new Attendance({
      studentId: req.params.id,
      ...req.body
    });
    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get attendance records for a student
app.get('/students/:id/attendance', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ studentId: req.params.id });
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add payment record for a student
app.post('/students/:id/payments', async (req, res) => {
  try {
    const payment = new Payment({
      studentId: req.params.id,
      ...req.body
    });
    await payment.save();
    res.status(201).send(payment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get payment records for a student
app.get('/students/:id/payments', async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.id });
    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
