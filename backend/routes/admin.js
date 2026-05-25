const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const User = require('../models/User');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All routes below require authentication
router.use(protect);

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalLeads, todayLeads, weekLeads, verifiedLeads, hotLeads, priorityLeads, siteVisits, statusCounts, sourceStats, projectStats, locationStats] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: today } }),
      Lead.countDocuments({ createdAt: { $gte: weekAgo } }),
      Lead.countDocuments({ isVerified: true }),
      Lead.countDocuments({ status: 'Hot' }),
      Lead.countDocuments({ status: 'Priority' }),
      Lead.countDocuments({ siteVisitRequested: true }),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$utmSource', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Lead.aggregate([{ $match: { interestedProject: { $ne: null } } }, { $group: { _id: '$interestedProject', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Lead.aggregate([{ $match: { preferredLocation: { $ne: null } } }, { $group: { _id: '$preferredLocation', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);

    res.json({
      success: true,
      data: {
        overview: { totalLeads, todayLeads, weekLeads, verifiedLeads, hotLeads, priorityLeads, siteVisits },
        statusCounts: Object.fromEntries(statusCounts.map(s => [s._id, s.count])),
        sourceStats,
        projectStats,
        locationStats,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get All Leads ───────────────────────────────────────────────────────────
router.get('/leads', async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search, utmSource, projectSlug, location, sort = '-createdAt' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (utmSource) query.utmSource = utmSource;
    if (projectSlug) query.interestedProject = projectSlug;
    if (location) query.$or = [{ preferredLocation: location }, { interestedLocation: location }];
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip((page - 1) * limit).limit(Number(limit)).populate('assignedTo', 'name email'),
      Lead.countDocuments(query),
    ]);

    res.json({ success: true, data: leads, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get Single Lead ─────────────────────────────────────────────────────────
router.get('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email mobile');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Update Lead ─────────────────────────────────────────────────────────────
router.put('/leads/:id', async (req, res) => {
  try {
    const allowedFields = ['status', 'assignedTo', 'followUpDate', 'remarks', 'lostReason', 'siteVisitStatus', 'siteVisitDate', 'buyingPurpose', 'budget', 'timeline'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Send WhatsApp Manually ───────────────────────────────────────────────────
router.post('/leads/:id/whatsapp', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    const { templateKey, extraData } = req.body;
    const { triggerAutomation } = require('../services/whatsappService');
    const result = await triggerAutomation(lead, templateKey, extraData);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Salesman Management ─────────────────────────────────────────────────────
router.get('/salesmen', authorize('admin', 'manager'), async (req, res) => {
  try {
    const users = await User.find({ role: 'salesman' }).select('-password');
    // Add performance data
    const enriched = await Promise.all(users.map(async (u) => {
      const assigned = await Lead.countDocuments({ assignedTo: u._id });
      const converted = await Lead.countDocuments({ assignedTo: u._id, status: 'Booked' });
      return { ...u.toObject(), leadsAssigned: assigned, leadsConverted: converted };
    }));
    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Projects CRUD ───────────────────────────────────────────────────────────
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/projects', authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/projects/:id', authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/projects/:id', authorize('admin'), async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Reports ─────────────────────────────────────────────────────────────────
router.get('/reports/source', async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $group: { _id: { source: '$utmSource', medium: '$utmMedium' }, count: { $sum: 1 }, avgScore: { $avg: '$score' } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/reports/project', async (req, res) => {
  try {
    const data = await Lead.aggregate([
      { $match: { interestedProject: { $exists: true, $ne: '' } } },
      { $group: { _id: '$interestedProject', total: { $sum: 1 }, hot: { $sum: { $cond: [{ $in: ['$status', ['Hot', 'Priority']] }, 1, 0] } }, converted: { $sum: { $cond: [{ $eq: ['$status', 'Booked'] }, 1, 0] } } } },
      { $sort: { total: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
