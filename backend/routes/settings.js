const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');

// ── In-memory cache — per siteKey ────────────────────────────────────────────
const _cache = {};
const _cacheExpiry = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function invalidateSettingsCache(siteKey = 'gurgaon') {
  delete _cache[siteKey];
  delete _cacheExpiry[siteKey];
}
module.exports.invalidateSettingsCache = invalidateSettingsCache;

// GET /api/settings?siteKey=bhiwadi — public, served from memory cache
router.get('/', async (req, res) => {
  try {
    const siteKey = (req.query.siteKey || 'gurgaon').toLowerCase();
    const now = Date.now();
    if (!_cache[siteKey] || now > (_cacheExpiry[siteKey] || 0)) {
      let settings = await SiteSettings.findOne({ siteKey }).lean();
      if (!settings) {
        // Fallback: if no siteKey-specific settings exist, use default (gurgaon)
        settings = await SiteSettings.findOne().lean();
        if (!settings) {
          const created = await SiteSettings.create({ siteKey });
          settings = created.toObject();
        }
      }
      _cache[siteKey] = settings;
      _cacheExpiry[siteKey] = now + CACHE_TTL;
    }
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600, stale-if-error=86400');
    res.json({ success: true, data: _cache[siteKey] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings?siteKey=bhiwadi — admin only
router.put('/', protect, async (req, res) => {
  try {
    const siteKey = (req.query.siteKey || req.body.siteKey || 'gurgaon').toLowerCase();
    let settings = await SiteSettings.findOne({ siteKey });

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
      settings = new SiteSettings({ ...body, siteKey });
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
    invalidateSettingsCache(siteKey);
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/settings/corridors — public
router.get('/corridors', async (req, res) => {
  try {
    const now = Date.now();
    if (!_cache || now > _cacheExpiry) {
      let settings = await SiteSettings.findOne().lean();
      if (!settings) { const c = await SiteSettings.create({}); settings = c.toObject(); }
      _cache = settings; _cacheExpiry = now + CACHE_TTL;
    }
    res.json({ success: true, data: _cache.corridors || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/settings/corridors — admin only
router.post('/corridors', protect, async (req, res) => {
  try {
    const { name, icon, city } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Name required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
    const citySlug = (city || 'Gurgaon').toLowerCase().replace(/\s+/g, '-');
    // Non-Gurgaon cities get a clean city page URL (e.g. /bhiwadi), Gurgaon gets corridor URL
    const href = (!city || city === 'Gurgaon') ? `/corridor/${slug}` : `/${citySlug}`;
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    // Prevent duplicate
    if ((settings.corridors || []).some(c => c.slug === slug))
      return res.status(400).json({ success: false, message: 'Corridor already exists' });
    settings.corridors.push({ name: name.trim(), slug, href, icon: icon || '🛣️', city: city || 'Gurgaon' });
    settings.markModified('corridors');
    await settings.save();
    invalidateSettingsCache();
    res.json({ success: true, data: settings.corridors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/settings/corridors/:slug — admin only
router.delete('/corridors/:slug', protect, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) return res.status(404).json({ success: false, message: 'Settings not found' });
    settings.corridors = (settings.corridors || []).filter(c => c.slug !== req.params.slug);
    settings.markModified('corridors');
    await settings.save();
    invalidateSettingsCache();
    res.json({ success: true, data: settings.corridors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
