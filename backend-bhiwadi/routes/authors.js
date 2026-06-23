const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const { protect: auth } = require('../middleware/auth');

// GET /api/authors — public: active only (or all if admin token provided)
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.all === 'true';
    const filter = isAdmin ? {} : { isActive: true };
    const authors = await Author.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: authors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/authors/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    const author = await Author.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!author) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: author });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/authors — admin only
router.post('/', auth, async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json({ success: true, data: author });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Slug already exists' });
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/authors/:id — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!author) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: author });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Slug already exists' });
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/authors/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
