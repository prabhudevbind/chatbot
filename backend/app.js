const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const StudentProfile = require('./models/StudentProfile');
const Attendance = require('./models/Attendance');
const Payment = require('./models/Payment');
var cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = 'dev980';

app.use(cors())

app.use('/auth', require('./routes/auth'));

 
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

app.use(express.static("build"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/build/index.html");
});
app.get("/api/name", function (req, res) {
  res.send("Hello World");
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
app.get('/profiledetails/:id', async function(req, res) {
  try {
    const studentId = req.params.id;
    const user = await StudentProfile.findOne({_id: studentId });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/students/login', async (req, res) => {
 
  const { email, password } = req.body;
  try {
    const user = await StudentProfile.findOne({email: email });
    if (!user) {
      return res.status(401).json({ loginStatus: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ loginStatus: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '15d' });
    res.status(200).json({ loginStatus: true, token ,id: user._id});
  } catch (error) {
    res.status(500).json({ loginStatus: false, message: 'Server error' });
  }
});
app.post('/admin/login', function(req, res) {
  const { email, password } = req.body;
  try {
    if (email && password) {
      if (email === "admin@gmail.com" && password === "admin") {
        const token = jwt.sign({ email: email, role: 'admin' }, JWT_SECRET, { expiresIn: '17d' });
        return res.status(200).json({ loginStatus: true, token });
      }
    }
    res.status(401).json({ loginStatus: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ loginStatus: false, message: 'Server error' });
  }
});


// Check-in API
app.post('/students/:id/checkin', async (req, res) => {
  try {
    const studentId = req.params.id;
    const now = new Date();
    const date = now.toLocaleDateString();

    const existingAttendance = await Attendance.findOne({studentId,date });

    if (existingAttendance) {
      return res.status(400).send({ error: 'You have already checked in today.' });
    }

    const attendance = new Attendance({
      studentId,
      date,
      checkInTime: now.toLocaleTimeString()
    });

    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Check-out API
app.post('/students/:id/checkout', async (req, res) => {
  try {
    const studentId = req.params.id;
    const now = new Date();
    const date = now.toLocaleDateString();

    const existingAttendance = await Attendance.findOne({studentId,date });

    if (!existingAttendance) {
      return res.status(400).send({ error: 'Please check in first.' });
    }

    if (existingAttendance.checkOutTime) {
      return res.status(400).send({ error: 'You have already checked out today.' });
    }

    existingAttendance.checkOutTime = now.toLocaleTimeString();
    await existingAttendance.save();

    res.status(200).send(existingAttendance);
  } catch (error) {
    res.status(500).send(error);
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
    const attendanceRecords = await Attendance.find({ studentId: req.params.id }).limit(10);
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
