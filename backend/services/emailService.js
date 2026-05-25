const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ─── HTML Templates ──────────────────────────────────────────────────────────

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GurgaonRealty</title>
  <style>
    body { margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7f6; color:#122326; }
    .wrapper { max-width:600px; margin:0 auto; }
    .header { background:#075B63; padding:28px 32px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:22px; font-weight:700; letter-spacing:0.5px; }
    .header p { color:#08C9A4; margin:4px 0 0; font-size:13px; }
    .body { background:#ffffff; padding:32px; }
    .footer { background:#f0f0f0; padding:16px 32px; text-align:center; font-size:12px; color:#5F7478; }
    .btn { display:inline-block; background:#08C9A4; color:#fff; padding:12px 28px; border-radius:8px;
           text-decoration:none; font-weight:600; font-size:15px; margin:16px 0; }
    .otp-box { background:#EAF8F5; border:2px solid #08C9A4; border-radius:12px;
               padding:20px; text-align:center; margin:20px 0; }
    .otp-number { font-size:36px; font-weight:800; color:#075B63; letter-spacing:10px; }
    .info-row { display:flex; justify-content:space-between; padding:10px 0;
                border-bottom:1px solid #DDEEEF; font-size:14px; }
    .label { color:#5F7478; }
    .value { color:#122326; font-weight:600; }
    .score-badge { display:inline-block; padding:4px 14px; border-radius:20px;
                   font-size:12px; font-weight:700; text-transform:uppercase; }
    .cold { background:#e3f2fd; color:#1565c0; }
    .warm { background:#fff3e0; color:#e65100; }
    .hot { background:#fce4ec; color:#c62828; }
    .priority { background:#f3e5f5; color:#6a1b9a; }
    h2 { color:#075B63; font-size:18px; margin:0 0 16px; }
    p { line-height:1.7; font-size:15px; color:#333; margin:0 0 12px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>🏙️ GurgaonRealty</h1>
    <p>Premium Real Estate Advisory in Gurgaon</p>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    © ${new Date().getFullYear()} GurgaonRealty · Gurgaon, Haryana
    <br>📞 ${process.env.SITE_PHONE || '+91-9999999999'} · 
    <a href="mailto:${process.env.SITE_EMAIL || 'info@gurgaonrealty.com'}" style="color:#075B63;">${process.env.SITE_EMAIL || 'info@gurgaonrealty.com'}</a>
  </div>
</div>
</body>
</html>`;

// ─── Email Functions ──────────────────────────────────────────────────────────

const sendOTPEmail = async ({ email, name, otp }) => {
  const transporter = createTransporter();
  const content = `
    <h2>Your Verification Code</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Your OTP to verify your mobile number on GurgaonRealty is:</p>
    <div class="otp-box">
      <div class="otp-number">${otp}</div>
      <p style="margin:8px 0 0; font-size:13px; color:#5F7478;">Valid for 5 minutes. Do not share this with anyone.</p>
    </div>
    <p>If you didn't request this, please ignore this email.</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'GurgaonRealty <noreply@gurgaonrealty.com>',
    to: email,
    subject: `${otp} – Your GurgaonRealty Verification Code`,
    html: baseTemplate(content),
  });
};

const sendLeadNotificationEmail = async (lead) => {
  const transporter = createTransporter();
  const scoreClass = lead.score <= 10 ? 'cold' : lead.score <= 30 ? 'warm' : lead.score <= 60 ? 'hot' : 'priority';

  const content = `
    <h2>🔥 New Lead Alert</h2>
    <p>A new lead has been captured on GurgaonRealty. Details below:</p>
    <div class="info-row"><span class="label">Name</span><span class="value">${lead.name || 'Not provided'}</span></div>
    <div class="info-row"><span class="label">Mobile</span><span class="value">${lead.mobile || 'Not provided'}</span></div>
    <div class="info-row"><span class="label">Email</span><span class="value">${lead.email || 'Not provided'}</span></div>
    <div class="info-row"><span class="label">Budget</span><span class="value">${lead.budget || 'Not specified'}</span></div>
    <div class="info-row"><span class="label">Location Interest</span><span class="value">${lead.preferredLocation || lead.interestedLocation || 'Not specified'}</span></div>
    <div class="info-row"><span class="label">Project Interest</span><span class="value">${lead.interestedProject || 'Not specified'}</span></div>
    <div class="info-row"><span class="label">Purpose</span><span class="value">${lead.buyingPurpose || 'Not specified'}</span></div>
    <div class="info-row"><span class="label">Timeline</span><span class="value">${lead.timeline || 'Not specified'}</span></div>
    <div class="info-row"><span class="label">Source Page</span><span class="value">${lead.sourcePage || 'Direct'}</span></div>
    <div class="info-row"><span class="label">UTM Source</span><span class="value">${lead.utmSource || 'Organic'}</span></div>
    <div class="info-row">
      <span class="label">Lead Score</span>
      <span class="value"><span class="score-badge ${scoreClass}">${lead.score} – ${lead.status}</span></span>
    </div>
    <br>
    <a href="${process.env.SITE_URL || 'http://localhost:3000'}/admin/leads/${lead._id}" class="btn">View Lead in CRM →</a>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'GurgaonRealty <noreply@gurgaonrealty.com>',
    to: process.env.ADMIN_EMAIL || 'admin@gurgaonrealty.com',
    subject: `🔥 New ${lead.status} Lead: ${lead.name || lead.mobile || 'Anonymous'} | ${lead.interestedProject || lead.interestedLocation || 'General'}`,
    html: baseTemplate(content),
  });
};

const sendLeadWelcomeEmail = async (lead) => {
  if (!lead.email) return;
  const transporter = createTransporter();

  const content = `
    <h2>Thank You for Your Interest! 🏡</h2>
    <p>Hi ${lead.name || 'there'},</p>
    <p>Thank you for exploring premium properties on <strong>GurgaonRealty</strong>. Our expert property advisor will reach out to you within <strong>2 hours</strong>.</p>
    <p>Here's a summary of your inquiry:</p>
    <div class="info-row"><span class="label">Interested In</span><span class="value">${lead.interestedProject || 'New Projects in Gurgaon'}</span></div>
    <div class="info-row"><span class="label">Budget Range</span><span class="value">${lead.budget || 'To be discussed'}</span></div>
    <div class="info-row"><span class="label">Purpose</span><span class="value">${lead.buyingPurpose || 'To be discussed'}</span></div>
    <div class="info-row"><span class="label">Timeline</span><span class="value">${lead.timeline || 'To be discussed'}</span></div>
    <br>
    <p>💬 While you wait, explore more premium projects on our website.</p>
    <a href="${process.env.SITE_URL || 'http://localhost:3000'}" class="btn">Explore New Projects →</a>
    <br><br>
    <p style="font-size:13px; color:#5F7478;">If you have any immediate questions, call us at <strong>${process.env.SITE_PHONE || '+91-9999999999'}</strong>.</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'GurgaonRealty <noreply@gurgaonrealty.com>',
    to: lead.email,
    subject: `Your Property Inquiry is Received – GurgaonRealty`,
    html: baseTemplate(content),
  });
};

const sendSiteVisitConfirmEmail = async (lead) => {
  if (!lead.email) return;
  const transporter = createTransporter();

  const content = `
    <h2>Site Visit Confirmed! 🗓️</h2>
    <p>Hi ${lead.name || 'there'},</p>
    <p>Your free site visit has been scheduled. Our property advisor will guide you through the project in person.</p>
    <p>Please carry a valid government ID for the site visit. For assistance, call us at <strong>${process.env.SITE_PHONE}</strong>.</p>
    <a href="${process.env.SITE_URL}" class="btn">Prepare for Your Visit →</a>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: lead.email,
    subject: `Site Visit Confirmed – GurgaonRealty`,
    html: baseTemplate(content),
  });
};

const sendBrochureEmail = async ({ email, name, projectName, brochureUrl }) => {
  if (!email) return;
  const transporter = createTransporter();

  const content = `
    <h2>Your Brochure is Ready 📄</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Here is the brochure for <strong>${projectName}</strong> that you requested.</p>
    <a href="${brochureUrl}" class="btn">Download Brochure →</a>
    <p style="font-size:13px; color:#5F7478; margin-top:16px;">Questions? Call us at <strong>${process.env.SITE_PHONE}</strong> or reply to this email.</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${projectName} – Brochure & Price Details | GurgaonRealty`,
    html: baseTemplate(content),
  });
};

module.exports = {
  sendOTPEmail,
  sendLeadNotificationEmail,
  sendLeadWelcomeEmail,
  sendSiteVisitConfirmEmail,
  sendBrochureEmail,
};
