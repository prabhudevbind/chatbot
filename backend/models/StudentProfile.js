const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seatNumber: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  profilePicture: { type: String, required: true }
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

module.exports = StudentProfile;
