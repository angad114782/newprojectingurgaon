const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const SiteSettings = require('../models/SiteSettings');

// GET /api/projects — List with filters
router.get('/', async (req, res) => {
  try {
    const { status, corridor, city, sector, microLocation, minPrice, maxPrice, config, featured, limit = 12, page = 1, sort = '-createdAt' } = req.query;

    const query = { isActive: true };
    if (status) query.status = status;
    if (corridor) query.corridor = { $regex: corridor, $options: 'i' };
    if (city) {
      // Map city slug to corridor names, then filter projects by those corridors
      const settings = await SiteSettings.findOne().lean().select('corridors');
      const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const corridorNames = (settings?.corridors || [])
        .filter(c => (c.city || 'Bhiwadi').toLowerCase() === city.toLowerCase())
        .map(c => c.name);
      if (!corridorNames.length) {
        return res.json({ success: true, data: [], total: 0, page: 1, pages: 0 });
      }
      query.corridor = { $in: corridorNames };
    }
    if (sector) query.sector = { $regex: sector, $options: 'i' };
    if (microLocation) query.microLocation = { $regex: microLocation, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.priceMin = {};
      if (minPrice) query.priceMin.$gte = Number(minPrice);
      if (maxPrice) query.priceMin.$lte = Number(maxPrice);
    }
    if (config) query.configurations = { $elemMatch: { $regex: config, $options: 'i' } };

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sort).skip((page - 1) * limit).limit(Number(limit)),
      Project.countDocuments(query),
    ]);

    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    res.json({ success: true, data: projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/featured
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true, isFeatured: true }).limit(6).sort('-createdAt');
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Increment view count
    await Project.findByIdAndUpdate(project._id, { $inc: { viewCount: 1 } });

    // Get similar projects
    const similar = await Project.find({
      _id: { $ne: project._id },
      isActive: true,
      $or: [{ microLocation: project.microLocation }, { status: project.status }],
    }).limit(3);

    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    res.json({ success: true, data: project, similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
