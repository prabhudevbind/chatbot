const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seatNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  profilePicture: { type: String, required: true },
  password: { type: String, required: true }
});

// Hash the password before saving the document
studentProfileSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

studentProfileSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

module.exports = StudentProfile;
