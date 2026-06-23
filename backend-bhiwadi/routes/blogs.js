const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect: auth } = require('../middleware/auth');
const { autoSubmit } = require('../services/indexing');

const SUMMARY_FIELDS = 'title slug excerpt heroImage category author.name date readTime status';

// GET /api/blogs — public: published only
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .select(SUMMARY_FIELDS)
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogs/all — admin: all including drafts
router.get('/all', auth, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .select(SUMMARY_FIELDS)
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogs/slugs — for sitemap
router.get('/slugs', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).select('slug').lean();
    res.json({ success: true, data: blogs.map((b) => b.slug) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogs/:slug — single post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    // Allow published for public; drafts only for admin (checked client-side via token)
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blogs — create (admin)
router.post('/', auth, async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({ success: true, data: blog });

    // Auto-submit published blogs
    if (blog.status === 'published' && blog.slug) {
      const SiteSettings = require('../models/SiteSettings');
      SiteSettings.findOne({}).lean().then(s => {
        if (s?.indexingAutoSubmit !== false && s?.googleSearchConsole?.siteUrl) {
          const url = `${s.googleSearchConsole.siteUrl.replace(/\/$/, '')}/blog/${blog.slug}`;
          autoSubmit([url]);
        }
      }).catch(() => {});
    }
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Slug already exists' });
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/blogs/:id — update (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    req.body.dateModified = new Date();
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: blog });

    // Auto-submit on publish
    if (blog.status === 'published' && blog.slug) {
      const SiteSettings = require('../models/SiteSettings');
      SiteSettings.findOne({}).lean().then(s => {
        if (s?.indexingAutoSubmit !== false && s?.googleSearchConsole?.siteUrl) {
          const url = `${s.googleSearchConsole.siteUrl.replace(/\/$/, '')}/blog/${blog.slug}`;
          autoSubmit([url]);
        }
      }).catch(() => {});
    }
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Slug already exists' });
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/blogs/:id — delete (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
