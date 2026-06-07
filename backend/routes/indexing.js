const express = require('express');
const router = express.Router();
const { protect: auth, authorize } = require('../middleware/auth');
const { submitUrls, writeIndexNowKeyFile } = require('../services/indexing');
const IndexingLog = require('../models/IndexingLog');
const SiteSettings = require('../models/SiteSettings');
const Project = require('../models/Project');
const Blog = require('../models/Blog');

// ─── POST /api/indexing/submit — manual URL submission ─────────────────────────
router.post('/submit', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { urls, action = 'URL_UPDATED' } = req.body;
    if (!urls || !urls.length) return res.status(400).json({ success: false, message: 'urls array required' });

    const result = await submitUrls(urls, { triggeredBy: 'manual', action });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/indexing/bulk-sitemap — submit all site URLs ───────────────────
router.post('/bulk-sitemap', auth, authorize('admin'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({}).lean();
    const siteUrl = settings?.googleSearchConsole?.siteUrl || '';

    if (!siteUrl) return res.status(400).json({ success: false, message: 'Site URL not configured in Settings → SEO → Search Console' });

    // Gather all public URLs
    const [projects, blogs] = await Promise.all([
      Project.find({ isActive: true }, 'slug').lean(),
      Blog.find({ status: 'published' }, 'slug').lean(),
    ]);

    const base = siteUrl.replace(/\/$/, '');
    const urls = [
      base + '/',
      base + '/new-projects-in-gurgaon',
      base + '/about',
      base + '/contact',
      ...projects.map(p => `${base}/projects/${p.slug}`),
      ...blogs.map(b => `${base}/blog/${b.slug}`),
    ];

    // Fire async — respond immediately so admin doesn't wait
    res.json({ success: true, message: `Submitting ${urls.length} URLs in background…`, total: urls.length });

    // Non-blocking
    submitUrls(urls, { triggeredBy: 'bulk' }).catch(e =>
      console.warn('[indexing] bulk submit failed:', e.message)
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/indexing/write-key — write IndexNow key file to public dir ─────
router.post('/write-key', auth, authorize('admin'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({}).lean();
    const key = settings?.indexNowKey;
    if (!key) return res.status(400).json({ success: false, message: 'IndexNow key not set in Settings → Integrations' });
    const ok = await writeIndexNowKeyFile(key);
    res.json({ success: ok, message: ok ? `Key file /${key}.txt created` : 'Could not write key file (check server path)' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/indexing/history — submission log ────────────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, engine, status } = req.query;
    const filter = {};
    if (engine) filter.engine = engine;
    if (status) filter.status = status;

    const [logs, total] = await Promise.all([
      IndexingLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      IndexingLog.countDocuments(filter),
    ]);

    res.json({ success: true, data: logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/indexing/stats — summary stats ──────────────────────────────────
router.get('/stats', auth, async (req, res) => {
  try {
    const [total, success, errors, today] = await Promise.all([
      IndexingLog.countDocuments(),
      IndexingLog.countDocuments({ status: 'success' }),
      IndexingLog.countDocuments({ status: 'error' }),
      IndexingLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 86400000) },
      }),
    ]);

    const byEngine = await IndexingLog.aggregate([
      { $group: { _id: '$engine', count: { $sum: 1 }, success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } } } },
    ]);

    res.json({ success: true, stats: { total, success, errors, today, byEngine } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/indexing/history — clear log ─────────────────────────────────
router.delete('/history', auth, authorize('admin'), async (req, res) => {
  try {
    await IndexingLog.deleteMany({});
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
