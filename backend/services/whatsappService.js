const Lead = require('../models/Lead');

// Build WhatsApp message URL
const buildWhatsAppURL = (phone, message) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${fullPhone}?text=${encodedMessage}`;
};

// Message Templates
const templates = {
  brochureRequested: ({ name, projectName }) =>
    `Hi ${name || 'there'}! 👋\n\nThanks for your interest in *${projectName}*.\n\nI'm sharing the latest brochure, price range and floor plans. Would you like to compare this with 2 similar projects nearby?\n\nReply *YES* to get a detailed comparison, or *CALL* to speak with our advisor. 😊\n\n_GurgaonRealty – Verified Real Estate Advisory_`,

  priceListRequested: ({ name, projectName, priceRange }) =>
    `Hi ${name || 'there'}! 🏡\n\nThe latest price range for *${projectName}*:\n📌 ${priceRange || 'Price on request'}\n\nPrices are subject to availability. Would you like to book a free site visit to get the best deal?\n\nReply *VISIT* to schedule one. ✅\n\n_GurgaonRealty – Transparent Pricing, Zero Brokerage_`,

  revisitProject: ({ name, projectName }) =>
    `Hi ${name || 'there'}! 👋\n\nI noticed you've been looking at *${projectName}* again. Looks like it's caught your attention!\n\nWould you like me to share a detailed comparison with 2 similar options in the same budget range?\n\nReply *COMPARE* and I'll send it right away. 📊\n\n_GurgaonRealty_`,

  locationInterest: ({ name, location, projects }) =>
    `Hi ${name || 'there'}! 🏙️\n\nBased on your interest in *${location}*, here are the top 3 options right now:\n\n${projects || '1. Project A\n2. Project B\n3. Project C'}\n\nAll verified, RERA approved, and within your budget. Want me to share details & pricing?\n\nReply *YES* to get the full breakdown. 📋\n\n_GurgaonRealty_`,

  investmentAngle: ({ name, location }) =>
    `Hi ${name || 'there'}! 📈\n\nFor investment in *${location}*, here's what matters most:\n✅ Entry price vs current market rate\n✅ Expected rental yield: 3–4% p.a.\n✅ Appreciation potential: 15–25% in 3 years\n✅ Possession timeline & builder track record\n\nWant me to send a quick investment comparison for top 3 projects? Reply *INVEST*.\n\n_GurgaonRealty – Smart Property Investment_`,

  selfUseAngle: ({ name, projectName }) =>
    `Hi ${name || 'there'}! 🏠\n\nFor your home at *${projectName}*, here's what you'll love:\n✅ Spacious floor plans with natural light\n✅ Premium amenities – pool, gym, kids' zone\n✅ Close to schools, hospitals & metro\n✅ 24/7 security & gated community\n\nWant to book a free site visit? Reply *VISIT* and we'll set it up! 🌿\n\n_GurgaonRealty – Home You'll Love_`,

  siteVisitConfirm: ({ name, projectName, date }) =>
    `Hi ${name || 'there'}! ✅\n\nYour free site visit for *${projectName}* is confirmed!\n📅 Date: ${date || 'To be confirmed'}\n📍 We'll send you the exact meeting point.\n\nOur property advisor will pick you up and give you a full tour.\n\nFor any changes, call: ${process.env.SITE_PHONE || '+91-9999999999'}\n\n_GurgaonRealty – Your Trusted Advisor_`,

  followUp: ({ name }) =>
    `Hi ${name || 'there'}! 👋\n\nJust checking in – did you get a chance to review the property details I shared?\n\nIf you have any questions about pricing, location or availability, I'm here to help.\n\nReply *CALL* to speak with our advisor or *MORE* for more options. 😊\n\n_GurgaonRealty_`,
};

// Send WhatsApp message (via Twilio WhatsApp API)
const sendWhatsAppMessage = async (lead, templateKey, extraData = {}) => {
  if (!lead.whatsappConsent || !lead.mobile) return;

  const templateFn = templates[templateKey];
  if (!templateFn) return;

  const message = templateFn({
    name: lead.name,
    ...extraData,
  });

  // Log in dev
  if (process.env.NODE_ENV === 'development' || !process.env.TWILIO_ACCOUNT_SID) {
    console.log(`📱 [WhatsApp MOCK] To: ${lead.mobile}\n${message}\n`);
    await Lead.findByIdAndUpdate(lead._id, {
      whatsappSent: true,
      whatsappSentAt: new Date(),
      $push: {
        whatsappMessages: {
          type: templateKey,
          message,
          status: 'sent',
        },
      },
    });
    return { success: true, devMode: true };
  }

  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const cleanPhone = lead.mobile.replace(/[^0-9]/g, '');
    const toNumber = `whatsapp:+91${cleanPhone}`;

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: toNumber,
      body: message,
    });

    await Lead.findByIdAndUpdate(lead._id, {
      whatsappSent: true,
      whatsappSentAt: new Date(),
      $push: {
        whatsappMessages: {
          type: templateKey,
          message,
          status: 'sent',
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('WhatsApp Error:', error.message);
    await Lead.findByIdAndUpdate(lead._id, {
      $push: {
        whatsappMessages: {
          type: templateKey,
          message,
          status: 'failed',
        },
      },
    });
    return { success: false, error: error.message };
  }
};

// Automation Triggers
const triggerAutomation = async (lead, event, data = {}) => {
  if (!lead.whatsappConsent || !lead.mobile) return;

  switch (event) {
    case 'brochure_requested':
      return sendWhatsAppMessage(lead, 'brochureRequested', data);
    case 'price_list_requested':
      return sendWhatsAppMessage(lead, 'priceListRequested', data);
    case 'project_revisit':
      return sendWhatsAppMessage(lead, 'revisitProject', data);
    case 'location_interest':
      return sendWhatsAppMessage(lead, 'locationInterest', data);
    case 'investment_intent':
      return sendWhatsAppMessage(lead, 'investmentAngle', data);
    case 'self_use_intent':
      return sendWhatsAppMessage(lead, 'selfUseAngle', data);
    case 'site_visit_confirmed':
      return sendWhatsAppMessage(lead, 'siteVisitConfirm', data);
    case 'follow_up':
      return sendWhatsAppMessage(lead, 'followUp', data);
    default:
      console.log(`Unknown automation event: ${event}`);
  }
};

module.exports = { sendWhatsAppMessage, triggerAutomation, buildWhatsAppURL, templates };
