const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { createAndSendOTP, verifyOTP } = require('../services/otpService');
const { triggerAutomation, sendAdminLeadNotification, sendUserThankYouWhatsApp } = require('../services/whatsappService');
const { sendLeadNotificationEmail, sendLeadWelcomeEmail } = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

// ─── Visitor ID ──────────────────────────────────────────────────────────────
// GET /api/leads/visitor-id — Create anonymous visitor ID
router.get('/visitor-id', async (req, res) => {
  const visitorId = uuidv4();
  res.json({ success: true, visitorId });
});

// ─── Track Event ─────────────────────────────────────────────────────────────
// POST /api/leads/track — Track anonymous behavior events
router.post('/track', async (req, res) => {
  try {
    const {
      visitorId, event, page, projectSlug, locationSlug,
      score, sessionData, device, utmData,
    } = req.body;

    if (!visitorId) return res.status(400).json({ success: false, message: 'visitorId required' });

    const scoreMap = {
      page_visit: 1,
      project_view: 3,
      project_revisit: 5,
      price_section_view: 7,
      brochure_click: 10,
      floor_plan_click: 10,
      whatsapp_click: 12,
      call_click: 15,
      site_visit_request: 25,
      location_page_view: 2,
      budget_filter: 2,
    };

    const scoreAdded = scoreMap[event] || 0;

    let lead = await Lead.findOne({ visitorId });

    if (!lead) {
      lead = await Lead.create({
        visitorId,
        deviceType: device?.type,
        browser: device?.browser,
        ipAddress: req.ip,
        utmSource: utmData?.utmSource,
        utmMedium: utmData?.utmMedium,
        utmCampaign: utmData?.utmCampaign,
        utmKeyword: utmData?.utmKeyword,
        referrer: utmData?.referrer,
        sourcePage: page,
      });
    }

    // Add event
    lead.addEvent(event, '', page, scoreAdded, projectSlug);

    // Track pages/projects/locations
    if (page && !lead.pagesViewed.includes(page)) lead.pagesViewed.push(page);
    if (projectSlug && !lead.projectsViewed.includes(projectSlug)) lead.projectsViewed.push(projectSlug);
    if (locationSlug && !lead.locationsViewed.includes(locationSlug)) lead.locationsViewed.push(locationSlug);

    await lead.save();

    // Trigger WhatsApp automations based on behavior
    if (event === 'project_revisit' && lead.isVerified) {
      await triggerAutomation(lead, 'project_revisit', { projectName: projectSlug });
    }

    res.json({ success: true, score: lead.score, status: lead.status });
  } catch (err) {
    console.error('Track error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── Send OTP ─────────────────────────────────────────────────────────────────
// POST /api/leads/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, visitorId, email, name } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile required' });

    const result = await createAndSendOTP({ mobile, visitorId, email, name });
    res.json({ success: true, message: 'OTP sent successfully', channel: result.channel, devMode: result.devMode });
  } catch (err) {
    console.error('OTP send error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────
// POST /api/leads/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp, visitorId, leadData } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: 'Mobile and OTP required' });

    // Run OTP verify + lead lookup in parallel
    const [result, leadByVisitor, leadByMobile] = await Promise.all([
      verifyOTP({ mobile, otp }),
      visitorId ? Lead.findOne({ visitorId }) : Promise.resolve(null),
      Lead.findOne({ mobile }),
    ]);
    if (!result.success) return res.status(400).json({ success: false, message: result.message });

    let lead = leadByVisitor || leadByMobile;

    if (!lead) {
      lead = new Lead({ visitorId: visitorId || uuidv4(), mobile });
    }

    // Update with verified data
    lead.mobile = mobile;
    lead.isVerified = true;
    lead.verifiedAt = new Date();

    if (leadData) {
      if (leadData.name) lead.name = leadData.name;
      if (leadData.email) lead.email = leadData.email;
      if (leadData.budget) lead.budget = leadData.budget;
      if (leadData.preferredLocation) lead.preferredLocation = leadData.preferredLocation;
      if (leadData.buyingPurpose) lead.buyingPurpose = leadData.buyingPurpose;
      if (leadData.timeline) lead.timeline = leadData.timeline;
      if (leadData.interestedProject) lead.interestedProject = leadData.interestedProject;
      if (leadData.interestedLocation) lead.interestedLocation = leadData.interestedLocation;
      if (leadData.whatsappConsent !== undefined) {
        lead.whatsappConsent = leadData.whatsappConsent;
        if (leadData.whatsappConsent) lead.consentTimestamp = new Date();
      }
    }

    lead.addEvent('otp_verified', 'User verified mobile OTP', '', 5);
    await lead.save();

    // Notify admin room in real-time
    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('lead:new', { lead });

    // Generate token and respond immediately — don't block on notifications
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ leadId: lead._id, visitorId: lead.visitorId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, message: 'Verified successfully', lead: { id: lead._id, name: lead.name, score: lead.score, status: lead.status }, token });

    // Fire-and-forget: notifications run after response is sent
    sendLeadNotificationEmail(lead).catch(e => console.error('Email notify error:', e.message));
    sendLeadWelcomeEmail(lead).catch(e => console.error('Welcome email error:', e.message));
    sendAdminLeadNotification(lead).catch(e => console.error('WA admin error:', e.message));
    sendUserThankYouWhatsApp(lead).catch(e => console.error('WA thankyou error:', e.message));
    if (lead.whatsappConsent) {
      if (lead.buyingPurpose === 'Investment') {
        triggerAutomation(lead, 'investment_intent', { location: lead.preferredLocation || lead.interestedLocation || 'Bhiwadi' }).catch(() => {});
      } else if (lead.buyingPurpose === 'Self Use' && lead.interestedProject) {
        triggerAutomation(lead, 'self_use_intent', { projectName: lead.interestedProject }).catch(() => {});
      }
    }
  } catch (err) {
    console.error('OTP verify error:', err.message);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// ─── Submit Lead Form ─────────────────────────────────────────────────────────
// POST /api/leads/submit
router.post('/submit', async (req, res) => {
  try {
    const { visitorId, name, mobile, email, budget, preferredLocation, buyingPurpose, timeline, interestedProject, sourcePage, utmData, whatsappConsent } = req.body;

    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile required' });

    let lead = await Lead.findOne({ visitorId }) || await Lead.findOne({ mobile });

    if (!lead) lead = new Lead({ visitorId: visitorId || uuidv4() });

    Object.assign(lead, {
      name, mobile, email, budget, preferredLocation, buyingPurpose, timeline,
      interestedProject, sourcePage, whatsappConsent,
    });
    if (utmData) {
      lead.utmSource = utmData.utmSource;
      lead.utmMedium = utmData.utmMedium;
      lead.utmCampaign = utmData.utmCampaign;
      lead.utmKeyword = utmData.utmKeyword;
    }
    if (whatsappConsent) lead.consentTimestamp = new Date();

    lead.addEvent('form_submitted', 'Lead form submitted', sourcePage, 15);
    await lead.save();

    // Notify admin room in real-time
    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('lead:new', { lead });

    res.json({ success: true, message: 'Thank you! Our advisor will contact you shortly.', leadId: lead._id });

    // Fire-and-forget
    sendLeadNotificationEmail(lead).catch(e => console.error('Email error:', e.message));
    sendLeadWelcomeEmail(lead).catch(e => console.error('Email error:', e.message));
    sendAdminLeadNotification(lead).catch(e => console.error('WA admin error:', e.message));
    sendUserThankYouWhatsApp(lead).catch(e => console.error('WA thankyou error:', e.message));
  } catch (err) {
    console.error('Submit error:', err.message);
    res.status(500).json({ success: false, message: 'Submission failed' });
  }
});

// ─── CTA Action ──────────────────────────────────────────────────────────────
// POST /api/leads/cta — High-intent CTA clicks (brochure, price list, site visit)
router.post('/cta', async (req, res) => {
  try {
    const { visitorId, ctaType, projectSlug, projectName, priceRange, location } = req.body;

    const lead = await Lead.findOne({ visitorId });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const scoreMap = { brochure: 10, price_list: 7, floor_plan: 10, site_visit: 25, whatsapp: 12, call: 15 };
    lead.addEvent(`cta_${ctaType}`, `CTA clicked: ${ctaType}`, '', scoreMap[ctaType] || 5, projectSlug);
    if (ctaType) lead.ctasClicked.push(ctaType);
    if (ctaType === 'site_visit') lead.siteVisitRequested = true;
    await lead.save();

    // Trigger WhatsApp automations
    if (lead.whatsappConsent && lead.isVerified) {
      if (ctaType === 'brochure') {
        await triggerAutomation(lead, 'brochure_requested', { projectName });
      } else if (ctaType === 'price_list') {
        await triggerAutomation(lead, 'price_list_requested', { projectName, priceRange });
      } else if (ctaType === 'site_visit') {
        await triggerAutomation(lead, 'site_visit_confirmed', { projectName });
      }
    }

    res.json({ success: true, score: lead.score, status: lead.status, requiresLogin: !lead.isVerified });
  } catch (err) {
    console.error('CTA error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
