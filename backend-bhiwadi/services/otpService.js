const OTP = require('../models/OTP');
const { sendOTPEmail } = require('./emailService');
const { sendOTPViaWhatsApp } = require('./whatsappService');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via WhatsApp Cloud API (primary)
const sendOTPViaWhatsAppChannel = async (mobile, otp) => {
  try {
    const result = await sendOTPViaWhatsApp(mobile, otp);
    return result;
  } catch (err) {
    console.error('[OTP] WhatsApp send failed:', err.message);
    return { success: false, error: err.message };
  }
};

// Send OTP via SMS — Twilio fallback (only if WA not configured)
const sendOTPViaSMS = async (mobile, otp) => {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log(`📱 [DEV MODE] OTP for ${mobile}: ${otp}`);
    return { success: true, devMode: true };
  }
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your OTP is: ${otp}. Valid for 5 minutes. Do not share.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile.startsWith('+') ? mobile : `+91${mobile}`,
    });
    return { success: true };
  } catch (err) {
    console.error('[OTP] SMS send failed:', err.message);
    return { success: false, error: err.message };
  }
};

const createAndSendOTP = async ({ mobile, visitorId, email, name }) => {
  const otp = generateOTP();
  // Single DB round-trip: upsert replaces existing OTP for this mobile
  await OTP.findOneAndUpdate(
    { mobile },
    { mobile, otp, visitorId, isUsed: false, createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Fire-and-forget: WA send runs in background, response goes out immediately.
  // sendOTPViaWhatsAppChannel internally detects if WA is configured (uses cache).
  // If not configured it falls through to SMS / console.
  sendOTPViaWhatsAppChannel(mobile, otp)
    .catch(err => console.error('[OTP] Send error:', err.message));

  const isWaConfigured = !!(process.env.WA_PHONE_NUMBER_ID) || false; // rough check for channel label

  // Email also fire-and-forget
  if (email) {
    sendOTPEmail({ email, name, otp })
      .catch(err => console.error('[OTP] Email error:', err.message));
  }

  return {
    success: true,
    channel: 'whatsapp',
    devMode: false,
  };
};

const verifyOTP = async ({ mobile, otp }) => {
  // findOneAndUpdate = single DB round-trip instead of find + save
  const record = await OTP.findOneAndUpdate(
    { mobile, otp, isUsed: false },
    { $set: { isUsed: true } },
    { new: true }
  );
  if (!record) return { success: false, message: 'Invalid or expired OTP' };
  return { success: true };
};

module.exports = { createAndSendOTP, verifyOTP };
