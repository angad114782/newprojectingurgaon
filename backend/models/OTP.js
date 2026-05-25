const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  visitorId: { type: String },
  attempts: { type: Number, default: 0 },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL 5 minutes
});

OTPSchema.index({ mobile: 1 });

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;
