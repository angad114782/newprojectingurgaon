const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');

// GET /api/settings — public, 5-min browser cache
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      const created = await SiteSettings.create({});
      settings = created.toObject();
    }
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600, stale-if-error=86400');
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings — admin only
router.put('/', protect, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    // Deep-clone body and strip masked sensitive fields so existing values are preserved
    const body = JSON.parse(JSON.stringify(req.body));
    if (body.smtp) {
      if (body.smtp.pass === '••••••••' || body.smtp.pass === '') delete body.smtp.pass;
    }
    if (body.whatsappCloud) {
      if (body.whatsappCloud.accessToken === '••••••••' || body.whatsappCloud.accessToken === '') {
        delete body.whatsappCloud.accessToken;
      }
    }

    if (!settings) {
      settings = new SiteSettings(body);
    } else {
      // Preserve existing sensitive fields before merge
      const existingSmtpPass = settings.smtp?.pass;
      const existingWaToken = settings.whatsappCloud?.accessToken;

      Object.assign(settings, body);

      // Re-apply preserved values if they were stripped
      if (!body.smtp?.pass && existingSmtpPass) {
        if (!settings.smtp) settings.smtp = {};
        settings.smtp.pass = existingSmtpPass;
      }
      if (!body.whatsappCloud?.accessToken && existingWaToken) {
        if (!settings.whatsappCloud) settings.whatsappCloud = {};
        settings.whatsappCloud.accessToken = existingWaToken;
      }

      settings.markModified('marketStats');
      settings.markModified('social');
      settings.markModified('smtp');
      settings.markModified('whatsappCloud');
      settings.markModified('testimonials');
      settings.markModified('locations');
      settings.markModified('builders');
      settings.markModified('faqs');
      settings.markModified('heroImages');
      settings.markModified('seoKeywords');
      settings.markModified('conversion');
      settings.markModified('companyInfo');
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
