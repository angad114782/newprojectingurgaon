const axios = require('axios');
const Lead = require('../models/Lead');

let _waCache = null;
let _waCacheAt = 0;
const WA_CACHE_TTL = 5 * 60 * 1000; // 5 min

const getWaSettings = async () => {
  if (_waCache && Date.now() - _waCacheAt < WA_CACHE_TTL) return _waCache;

  let result;
  try {
    const SiteSettings = require('../models/SiteSettings');
    const settings = await SiteSettings.findOne({}).lean();
    if (settings?.whatsappCloud?.phoneNumberId && settings?.whatsappCloud?.accessToken) {
      result = {
        phoneNumberId: settings.whatsappCloud.phoneNumberId,
        accessToken: settings.whatsappCloud.accessToken,
        adminNumber: settings.whatsappCloud.adminNumber || '',
        templateLanguage: settings.whatsappCloud.templateLanguage || 'en',
        templateName: settings.whatsappCloud.templateName || 'lead_notification',
        otpTemplateName: settings.whatsappCloud.otpTemplateName || 'otp_verification',
        thankYouTemplateName: settings.whatsappCloud.thankYouTemplateName || 'thank_you_enquiry',
        brochureTemplateName: settings.whatsappCloud.brochureTemplateName || 'brochure_send',
        siteVisitTemplateName: settings.whatsappCloud.siteVisitTemplateName || 'site_visit_confirm',
        priceListTemplateName: settings.whatsappCloud.priceListTemplateName || 'price_list_send',
        reengageTemplateName: settings.whatsappCloud.reengageTemplateName || 'reengage_lead',
        siteName: settings.siteName || 'Property in Bhiwadi',
        sitePhone: settings.phone || '+91-8619930583',
        configured: true,
      };
    }
  } catch (_) {}

  if (!result) {
    result = {
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID || '',
      accessToken: process.env.WA_ACCESS_TOKEN || '',
      adminNumber: process.env.WA_ADMIN_NUMBER || '',
      templateLanguage: 'en',
      templateName: process.env.WA_TEMPLATE_NAME || 'lead_notification',
      otpTemplateName: process.env.WA_OTP_TEMPLATE_NAME || 'otp_verification',
      thankYouTemplateName: process.env.WA_THANKYOU_TEMPLATE_NAME || 'thank_you_enquiry',
      brochureTemplateName: process.env.WA_BROCHURE_TEMPLATE_NAME || 'brochure_send',
      siteVisitTemplateName: process.env.WA_SITE_VISIT_TEMPLATE_NAME || 'site_visit_confirm',
      priceListTemplateName: process.env.WA_PRICE_LIST_TEMPLATE_NAME || 'price_list_send',
      reengageTemplateName: process.env.WA_REENGAGE_TEMPLATE_NAME || 'reengage_lead',
      siteName: process.env.SITE_NAME || 'Property in Bhiwadi',
      sitePhone: process.env.SITE_PHONE || '+91-8619930583',
      configured: !!(process.env.WA_PHONE_NUMBER_ID && process.env.WA_ACCESS_TOKEN),
    };
  }

  _waCache = result;
  _waCacheAt = Date.now();
  return result;
};

const cleanPhone = (number) => {
  const n = String(number).replace(/[^0-9]/g, '');
  return n.startsWith('91') ? n : `91${n}`;
};

// ─── WhatsApp Cloud API: send text message ────────────────────────────────────
const sendWACloudMessage = async (cfg, toNumber, message) => {
  const url = `https://graph.facebook.com/v19.0/${cfg.phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: cleanPhone(toNumber),
    type: 'text',
    text: { preview_url: false, body: message },
  };
  const resp = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${cfg.accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
};

// ─── WhatsApp Cloud API: send template message ───────────────────────────────
const sendWACloudTemplate = async (cfg, toNumber, templateName, languageCode, components = []) => {
  const url = `https://graph.facebook.com/v19.0/${cfg.phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: cleanPhone(toNumber),
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components.length ? { components } : {}),
    },
  };
  const resp = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${cfg.accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
};

// ─── Send Thank You WhatsApp to USER after OTP verification ──────────────────
// Primary: thank_you_enquiry template (needs Meta approval)
// Fallback: plain text message (works within 24-hr service window after OTP)
const sendUserThankYouWhatsApp = async (lead) => {
  if (!lead.mobile || !lead.whatsappConsent) return;

  const cfg = await getWaSettings();
  const firstName = (lead.name || 'there').split(' ')[0];
  const project = lead.interestedProject || 'Property in Bhiwadi';

  // Plain text fallback message (used if template not approved yet)
  const textMessage =
    `Hi ${firstName}! 🎉\n\n` +
    `Thank you for your enquiry about *${project}*.\n\n` +
    `✅ Your request has been received.\n` +
    `📞 Our advisor will call you within *2 hours*.\n\n` +
    `To speak now, call: ${cfg.sitePhone}\n\n` +
    `_RERA Verified | Zero Brokerage | Free Site Visit_`;

  if (!cfg.configured) {
    console.log(`📱 [WA Thank You MOCK] To: +91${lead.mobile}\n${textMessage}`);
    return;
  }

  // Try approved template first, fall back to text message
  try {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: firstName },
          { type: 'text', text: project },
          { type: 'text', text: cfg.sitePhone },
        ],
      },
    ];
    await sendWACloudTemplate(cfg, lead.mobile, cfg.thankYouTemplateName, cfg.templateLanguage, components);
    console.log(`[WhatsApp] Thank you template sent to ${lead.mobile}`);
  } catch (templateErr) {
    console.warn(`[WhatsApp] Template "${cfg.thankYouTemplateName}" not approved yet — sending text fallback`);
    try {
      await sendWACloudMessage(cfg, lead.mobile, textMessage);
      console.log(`[WhatsApp] Thank you text message sent to ${lead.mobile}`);
    } catch (textErr) {
      console.error('[WhatsApp] Thank you fallback also failed:', textErr.response?.data || textErr.message);
    }
  }
};

// ─── Send admin WhatsApp notification when a new lead arrives ─────────────────
// WhatsApp Cloud API requires an approved template for the FIRST message.
// Template variables map: {{1}}=name, {{2}}=mobile, {{3}}=project, {{4}}=budget, {{5}}=location
// cfg.adminNumber supports comma-separated numbers: "919XXXXXXXXX,918XXXXXXXXX"
const sendAdminLeadNotification = async (lead) => {
  const cfg = await getWaSettings();
  if (!cfg.configured || !cfg.adminNumber) {
    console.log('[WhatsApp] Not configured or no admin number — skipping admin notification');
    return;
  }

  const components = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: lead.name || 'Not provided' },
        { type: 'text', text: lead.mobile ? `+91-${lead.mobile}` : 'N/A' },
        { type: 'text', text: lead.interestedProject || 'General Inquiry' },
        { type: 'text', text: lead.budget || 'Not specified' },
        { type: 'text', text: lead.preferredLocation || lead.interestedLocation || 'Not specified' },
      ],
    },
  ];

  // Support comma-separated admin numbers
  const adminNumbers = String(cfg.adminNumber).split(',').map((n) => n.trim()).filter(Boolean);

  for (const adminNum of adminNumbers) {
    try {
      await sendWACloudTemplate(cfg, adminNum, cfg.templateName, cfg.templateLanguage, components);
      console.log(`[WhatsApp] Admin template notification sent to ${adminNum}`);
    } catch (err) {
      console.error(`[WhatsApp] Admin notification failed for ${adminNum}:`, err.response?.data || err.message);
    }
  }
};

// ─── Message Templates (for lead follow-up) ──────────────────────────────────
const templates = {
  brochureRequested: ({ name, projectName }) =>
    `Hi ${name || 'there'}! 👋\n\nThanks for your interest in *${projectName}*.\n\nI'm sharing the latest brochure, price range and floor plans. Would you like to compare this with 2 similar projects nearby?\n\nReply *YES* to get a detailed comparison, or *CALL* to speak with our advisor. 😊\n\n_${name ? `— ${name}` : ''} | Property in Bhiwadi_`,

  priceListRequested: ({ name, projectName, priceRange }) =>
    `Hi ${name || 'there'}! 🏡\n\nThe latest price range for *${projectName}*:\n📌 ${priceRange || 'Price on request'}\n\nPrices are subject to availability. Would you like to book a free site visit to get the best deal?\n\nReply *VISIT* to schedule one. ✅\n\n_Property in Bhiwadi – Transparent Pricing, Zero Brokerage_`,

  revisitProject: ({ name, projectName }) =>
    `Hi ${name || 'there'}! 👋\n\nI noticed you've been looking at *${projectName}* again. Looks like it's caught your attention!\n\nWould you like me to share a detailed comparison with 2 similar options in the same budget range?\n\nReply *COMPARE* and I'll send it right away. 📊\n\n_Property in Bhiwadi_`,

  investmentAngle: ({ name, location }) =>
    `Hi ${name || 'there'}! 📈\n\nFor investment in *${location}*, here's what matters most:\n✅ Entry price vs current market rate\n✅ Expected rental yield: 4–6% p.a. (best in NCR)\n✅ Appreciation potential: 22–35% in 3 years\n✅ Possession timeline & builder track record\n\nWant me to send a quick investment comparison for top 3 projects? Reply *INVEST*.\n\n_Property in Bhiwadi – Smart Property Investment_`,

  selfUseAngle: ({ name, projectName }) =>
    `Hi ${name || 'there'}! 🏠\n\nFor your home at *${projectName}*, here's what you'll love:\n✅ Spacious floor plans with natural light\n✅ Premium amenities – pool, gym, kids' zone\n✅ Close to schools, hospitals & metro\n✅ 24/7 security & gated community\n\nWant to book a free site visit? Reply *VISIT* and we'll set it up! 🌿\n\n_Property in Bhiwadi – Home You'll Love_`,

  siteVisitConfirm: ({ name, projectName, date, sitePhone }) =>
    `Hi ${name || 'there'}! ✅\n\nYour free site visit for *${projectName}* is confirmed!\n📅 Date: ${date || 'To be confirmed'}\n📍 We'll send you the exact meeting point.\n\nOur property advisor will pick you up and give you a full tour.\n\nFor any changes, call: ${sitePhone || '+91-8619930583'}\n\n_Property in Bhiwadi – Your Trusted Advisor_`,

  followUp: ({ name }) =>
    `Hi ${name || 'there'}! 👋\n\nJust checking in – did you get a chance to review the property details I shared?\n\nIf you have any questions about pricing, location or availability, I'm here to help.\n\nReply *CALL* to speak with our advisor or *MORE* for more options. 😊\n\n_Property in Bhiwadi_`,
};

// ─── Send lead WhatsApp message (follow-up automations) ──────────────────────
const sendWhatsAppMessage = async (lead, templateKey, extraData = {}) => {
  if (!lead.whatsappConsent || !lead.mobile) return;
  const templateFn = templates[templateKey];
  if (!templateFn) return;

  const cfg = await getWaSettings();
  const message = templateFn({ name: lead.name, sitePhone: cfg.sitePhone, ...extraData });

  if (!cfg.configured) {
    console.log(`📱 [WhatsApp MOCK] To: ${lead.mobile}\n${message}\n`);
    await Lead.findByIdAndUpdate(lead._id, {
      whatsappSent: true,
      whatsappSentAt: new Date(),
      $push: { whatsappMessages: { type: templateKey, message, status: 'sent' } },
    });
    return { success: true, devMode: true };
  }

  try {
    await sendWACloudMessage(cfg, lead.mobile, message);
    await Lead.findByIdAndUpdate(lead._id, {
      whatsappSent: true,
      whatsappSentAt: new Date(),
      $push: { whatsappMessages: { type: templateKey, message, status: 'sent' } },
    });
    return { success: true };
  } catch (error) {
    console.error('[WhatsApp] Message failed:', error.response?.data || error.message);
    await Lead.findByIdAndUpdate(lead._id, {
      $push: { whatsappMessages: { type: templateKey, message, status: 'failed' } },
    });
    return { success: false, error: error.message };
  }
};

// ─── Automation Triggers ──────────────────────────────────────────────────────
const triggerAutomation = async (lead, event, data = {}) => {
  if (!lead.whatsappConsent || !lead.mobile) return;
  switch (event) {
    case 'brochure_requested':   return sendWhatsAppMessage(lead, 'brochureRequested', data);
    case 'price_list_requested': return sendWhatsAppMessage(lead, 'priceListRequested', data);
    case 'project_revisit':      return sendWhatsAppMessage(lead, 'revisitProject', data);
    case 'location_interest':    return sendWhatsAppMessage(lead, 'locationInterest', data);
    case 'investment_intent':    return sendWhatsAppMessage(lead, 'investmentAngle', data);
    case 'self_use_intent':      return sendWhatsAppMessage(lead, 'selfUseAngle', data);
    case 'site_visit_confirmed': return sendWhatsAppMessage(lead, 'siteVisitConfirm', data);
    case 'follow_up':            return sendWhatsAppMessage(lead, 'followUp', data);
    default: console.log(`Unknown automation event: ${event}`);
  }
};

// ─── Send OTP via WhatsApp AUTHENTICATION template ───────────────────────────
// Meta AUTHENTICATION templates have:
//   Body:   {{1}} = OTP code
//   Button: sub_type "url", parameter = OTP code (for "Copy Code" button)
const sendOTPViaWhatsApp = async (mobile, otp) => {
  const cfg = await getWaSettings();
  if (!cfg.configured) {
    console.log(`📱 [WhatsApp OTP MOCK] To: ${mobile} — OTP: ${otp}`);
    return { success: true, devMode: true };
  }

  try {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: otp },
        ],
      },
      {
        // "Copy Code" button — sub_type url, index 0, parameter = OTP
        type: 'button',
        sub_type: 'url',
        index: '0',
        parameters: [
          { type: 'text', text: otp },
        ],
      },
    ];

    await sendWACloudTemplate(cfg, mobile, cfg.otpTemplateName, cfg.templateLanguage, components);
    console.log(`[WhatsApp OTP] Sent to ${mobile}`);
    return { success: true };
  } catch (err) {
    console.error('[WhatsApp OTP] Failed:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

const testWaConnection = async (waCfg) => {
  const url = `https://graph.facebook.com/v19.0/${waCfg.phoneNumberId}`;
  const resp = await axios.get(url, {
    headers: { Authorization: `Bearer ${waCfg.accessToken}` },
  });
  return { success: true, data: resp.data };
};

const buildWhatsAppURL = (phone, message) => {
  const n = String(phone).replace(/[^0-9]/g, '');
  const full = n.startsWith('91') ? n : `91${n}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
};

module.exports = {
  sendWhatsAppMessage,
  sendAdminLeadNotification,
  sendUserThankYouWhatsApp,
  sendOTPViaWhatsApp,
  triggerAutomation,
  testWaConnection,
  buildWhatsAppURL,
  templates,
  _invalidateCache: () => { _waCache = null; },
  _getWaSettingsPublic: getWaSettings,
};
