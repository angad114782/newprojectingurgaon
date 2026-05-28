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
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
      settings.markModified('marketStats');
      settings.markModified('social');
      settings.markModified('testimonials');
      settings.markModified('locations');
      settings.markModified('builders');
      settings.markModified('faqs');
      settings.markModified('heroImages');
      settings.markModified('seoKeywords');
      settings.markModified('conversion');
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
