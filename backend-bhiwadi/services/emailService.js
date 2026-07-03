const nodemailer = require('nodemailer');

let _smtpCache = null;
let _smtpCacheAt = 0;
const SMTP_CACHE_TTL = 5 * 60 * 1000; // 5 min

const getSmtpSettings = async () => {
  if (_smtpCache && Date.now() - _smtpCacheAt < SMTP_CACHE_TTL) return _smtpCache;

  let result;
  try {
    const SiteSettings = require('../models/SiteSettings');
    const settings = await SiteSettings.findOne({}).lean();
    if (settings?.smtp?.user && settings?.smtp?.pass) {
      result = {
        host: settings.smtp.host || 'smtp.hostinger.com',
        port: settings.smtp.port || 587,
        secure: settings.smtp.secure || false,
        user: settings.smtp.user,
        pass: settings.smtp.pass,
        from: settings.smtp.from || settings.smtp.user,
        notificationEmail: settings.notificationEmail || settings.email || '',
        siteName: settings.siteName || 'New Projects in Bhiwadi',
        sitePhone: settings.phone || '+91-8619930583',
        siteEmail: settings.email || '',
        siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      };
    }
  } catch (_) {}

  if (!result) {
    result = {
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
      from: process.env.EMAIL_FROM || '',
      notificationEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
      siteName: process.env.SITE_NAME || 'New Projects in Bhiwadi',
      sitePhone: process.env.SITE_PHONE || '+91-8619930583',
      siteEmail: process.env.SITE_EMAIL || '',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    };
  }

  _smtpCache = result;
  _smtpCacheAt = Date.now();
  return result;
};

const createTransporter = (cfg) => nodemailer.createTransport({
  host: cfg.host,
  port: cfg.port,
  secure: cfg.secure,
  auth: { user: cfg.user, pass: cfg.pass },
  tls: { rejectUnauthorized: false },
});

// ─── HTML Templates ──────────────────────────────────────────────────────────

const baseTemplate = (content, cfg) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cfg.siteName}</title>
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
    <h1>🏙️ ${cfg.siteName}</h1>
    <p>Premium Real Estate Advisory in Bhiwadi, Rajasthan</p>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    © ${new Date().getFullYear()} ${cfg.siteName} · Bhiwadi, Rajasthan
    <br>📞 ${cfg.sitePhone} · <a href="mailto:${cfg.siteEmail}" style="color:#075B63;">${cfg.siteEmail}</a>
  </div>
</div>
</body>
</html>`;

// ─── Email Functions ──────────────────────────────────────────────────────────

const sendOTPEmail = async ({ email, name, otp }) => {
  const cfg = await getSmtpSettings();
  if (!cfg.user || !cfg.pass) return;
  const transporter = createTransporter(cfg);
  const content = `
    <h2>Your Verification Code</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Your OTP to verify your mobile number on ${cfg.siteName} is:</p>
    <div class="otp-box">
      <div class="otp-number">${otp}</div>
      <p style="margin:8px 0 0; font-size:13px; color:#5F7478;">Valid for 5 minutes. Do not share this with anyone.</p>
    </div>
    <p>If you didn't request this, please ignore this email.</p>`;
  await transporter.sendMail({
    from: `${cfg.siteName} <${cfg.from}>`,
    to: email,
    subject: `${otp} – Your ${cfg.siteName} Verification Code`,
    html: baseTemplate(content, cfg),
  });
};

const sendLeadNotificationEmail = async (lead) => {
  const cfg = await getSmtpSettings();
  if (!cfg.user || !cfg.pass || !cfg.notificationEmail) {
    console.log('[Email] SMTP not configured — skipping lead notification email');
    return;
  }
  const transporter = createTransporter(cfg);
  const scoreClass = lead.score <= 10 ? 'cold' : lead.score <= 30 ? 'warm' : lead.score <= 60 ? 'hot' : 'priority';

  const content = `
    <h2>🔥 New Lead Alert</h2>
    <p>A new lead has been captured on ${cfg.siteName}. Details below:</p>
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
    <a href="${cfg.siteUrl}/admin" class="btn">View in Admin CRM →</a>`;

  await transporter.sendMail({
    from: `${cfg.siteName} <${cfg.from}>`,
    to: cfg.notificationEmail,
    subject: `🔥 New ${lead.status} Lead: ${lead.name || lead.mobile || 'Anonymous'} | ${lead.interestedProject || lead.interestedLocation || 'General'}`,
    html: baseTemplate(content, cfg),
  });
};

const sendLeadWelcomeEmail = async (lead) => {
  if (!lead.email) return;
  const cfg = await getSmtpSettings();
  if (!cfg.user || !cfg.pass) return;
  const transporter = createTransporter(cfg);

  const content = `
    <h2>Thank You for Your Interest! 🏡</h2>
    <p>Hi ${lead.name || 'there'},</p>
    <p>Thank you for exploring premium properties on <strong>${cfg.siteName}</strong>. Our expert property advisor will reach out to you within <strong>2 hours</strong>.</p>
    <p>Here's a summary of your inquiry:</p>
    <div class="info-row"><span class="label">Interested In</span><span class="value">${lead.interestedProject || 'New Projects in Bhiwadi'}</span></div>
    <div class="info-row"><span class="label">Budget Range</span><span class="value">${lead.budget || 'To be discussed'}</span></div>
    <div class="info-row"><span class="label">Purpose</span><span class="value">${lead.buyingPurpose || 'To be discussed'}</span></div>
    <div class="info-row"><span class="label">Timeline</span><span class="value">${lead.timeline || 'To be discussed'}</span></div>
    <br>
    <p>💬 While you wait, explore more premium projects on our website.</p>
    <a href="${cfg.siteUrl}" class="btn">Explore New Projects →</a>
    <br><br>
    <p style="font-size:13px; color:#5F7478;">If you have any immediate questions, call us at <strong>${cfg.sitePhone}</strong>.</p>`;

  await transporter.sendMail({
    from: `${cfg.siteName} <${cfg.from}>`,
    to: lead.email,
    subject: `Your Property Inquiry is Received – ${cfg.siteName}`,
    html: baseTemplate(content, cfg),
  });
};

const sendSiteVisitConfirmEmail = async (lead) => {
  if (!lead.email) return;
  const cfg = await getSmtpSettings();
  if (!cfg.user || !cfg.pass) return;
  const transporter = createTransporter(cfg);

  const content = `
    <h2>Site Visit Confirmed! 🗓️</h2>
    <p>Hi ${lead.name || 'there'},</p>
    <p>Your free site visit has been scheduled. Our property advisor will guide you through the project in person.</p>
    <p>Please carry a valid government ID for the site visit. For assistance, call us at <strong>${cfg.sitePhone}</strong>.</p>
    <a href="${cfg.siteUrl}" class="btn">Prepare for Your Visit →</a>`;

  await transporter.sendMail({
    from: `${cfg.siteName} <${cfg.from}>`,
    to: lead.email,
    subject: `Site Visit Confirmed – ${cfg.siteName}`,
    html: baseTemplate(content, cfg),
  });
};

const sendBrochureEmail = async ({ email, name, projectName, brochureUrl }) => {
  if (!email) return;
  const cfg = await getSmtpSettings();
  if (!cfg.user || !cfg.pass) return;
  const transporter = createTransporter(cfg);

  const content = `
    <h2>Your Brochure is Ready 📄</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Here is the brochure for <strong>${projectName}</strong> that you requested.</p>
    <a href="${brochureUrl}" class="btn">Download Brochure →</a>
    <p style="font-size:13px; color:#5F7478; margin-top:16px;">Questions? Call us at <strong>${cfg.sitePhone}</strong> or reply to this email.</p>`;

  await transporter.sendMail({
    from: `${cfg.siteName} <${cfg.from}>`,
    to: email,
    subject: `${projectName} – Brochure & Price Details | ${cfg.siteName}`,
    html: baseTemplate(content, cfg),
  });
};

const testSmtpConnection = async (smtpConfig) => {
  const cfg = {
    host: smtpConfig.host || 'smtp.hostinger.com',
    port: smtpConfig.port || 587,
    secure: smtpConfig.secure || false,
    user: smtpConfig.user,
    pass: smtpConfig.pass,
    from: smtpConfig.from || smtpConfig.user,
  };
  const transporter = createTransporter(cfg);
  await transporter.verify();
  return { success: true };
};

module.exports = {
  sendOTPEmail,
  sendLeadNotificationEmail,
  sendLeadWelcomeEmail,
  sendSiteVisitConfirmEmail,
  sendBrochureEmail,
  testSmtpConnection,
  _invalidateCache: () => { _smtpCache = null; },
};
