const OTP = require('../models/OTP');
const { sendOTPEmail } = require('./emailService');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via SMS (Twilio) or log to console in dev
const sendOTPViaSMS = async (mobile, otp) => {
  if (process.env.NODE_ENV === 'development' || !process.env.TWILIO_ACCOUNT_SID) {
    console.log(`📱 [DEV MODE] OTP for ${mobile}: ${otp}`);
    return { success: true, devMode: true };
  }

  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Your GurgaonRealty OTP is: ${otp}. Valid for 5 minutes. Do not share.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile.startsWith('+') ? mobile : `+91${mobile}`,
    });
    return { success: true };
  } catch (error) {
    console.error('SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};

const createAndSendOTP = async ({ mobile, visitorId, email, name }) => {
  // Delete existing OTPs for this mobile
  await OTP.deleteMany({ mobile });

  const otp = generateOTP();

  // Save to DB
  await OTP.create({
    mobile,
    otp,
    visitorId,
  });

  // Send via SMS
  const smsResult = await sendOTPViaSMS(mobile, otp);

  // Also send via email if provided
  if (email) {
    try {
      await sendOTPEmail({ email, name, otp });
    } catch (err) {
      console.error('OTP email error:', err.message);
    }
  }

  return { success: true, smsResult };
};

const verifyOTP = async ({ mobile, otp }) => {
  const record = await OTP.findOne({
    mobile,
    otp,
    isUsed: false,
  });

  if (!record) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  // Mark as used
  record.isUsed = true;
  await record.save();

  return { success: true };
};

module.exports = { createAndSendOTP, verifyOTP };
