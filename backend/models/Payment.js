const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  month: { type: String, required: true },
  amount: { type: String, required: true },
  paymentMode: { type: String, required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
