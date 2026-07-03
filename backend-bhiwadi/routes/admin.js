const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const { protect, authorize } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { autoSubmit } = require('../services/indexing');

// ─── CSV Helpers ──────────────────────────────────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => { row[h] = (values[idx] || '').replace(/^"|"$/g, '').trim(); });
    rows.push(row);
  }
  return rows;
}

async function downloadImageFromUrl(url, baseUrl) {
  if (!url || !url.startsWith('http')) return url;
  try {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const rawExt = url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
    const fileExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(rawExt) ? rawExt : 'jpg';
    const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e6)}.${fileExt}`;
    const filepath = path.join(uploadDir, filename);
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 20000,
      headers: { 'User-Agent': 'Mozilla/5.0 PropertyInBhiwadiBot/1.0' },
    });
    const writer = fs.createWriteStream(filepath);
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    return `${baseUrl}/api/uploads/${filename}`;
  } catch (err) {
    console.error(`Image download failed (${url}):`, err.message);
    return url;
  }
}

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.toLowerCase().endsWith('.csv')) cb(null, true);
    else cb(new Error('Only CSV files are allowed'));
  },
});

// ─── Helper: mask sensitive settings fields ───────────────────────────────────
function maskSettings(obj) {
  const masked = JSON.parse(JSON.stringify(obj));
  if (masked.smtp?.pass) masked.smtp.pass = '••••••••';
  if (masked.whatsappCloud?.accessToken) masked.whatsappCloud.accessToken = '••••••••';
  return masked;
}

// ─── Admin Login (email + password) ──────────────────────────────────────────
// ─── Get Profile ─────────────────────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Update Profile ───────────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, mobile, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name)   user.name   = name;
    if (email)  user.email  = email;
    if (mobile) user.mobile = mobile;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password required to set new password' });
      const ok = await user.matchPassword(currentPassword);
      if (!ok) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: { name: user.name, email: user.email, mobile: user.mobile } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

// ─── Helper: strip country code → 10-digit mobile ────────────────────────────
function normalizeMobile(mobile) {
  return String(mobile || '').replace(/\D/g, '').replace(/^91/, '').slice(-10);
}

// ─── Admin Login via Mobile OTP ───────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile number required' });

    const clean = normalizeMobile(mobile);
    if (clean.length !== 10) return res.status(400).json({ success: false, message: 'Enter valid 10-digit mobile number' });

    // Load admin number from SiteSettings (dynamic — set in WhatsApp Cloud API settings)
    const SiteSettings = require('../models/SiteSettings');
    const settings = await SiteSettings.findOne({}).lean();
    const adminNo = normalizeMobile(settings?.whatsappCloud?.adminNumber || '');

    // Also check User table as fallback
    const userByMobile = await User.findOne({
      mobile: { $in: [clean, `91${clean}`, `+91${clean}`] },
      role: { $in: ['admin', 'manager'] },
    });

    const isSettingsAdmin = adminNo && adminNo === clean;
    if (!isSettingsAdmin && !userByMobile) {
      return res.status(403).json({ success: false, message: 'This number is not authorized as admin.' });
    }

    const { createAndSendOTP } = require('../services/otpService');
    const email = userByMobile?.email || '';
    const name = userByMobile?.name || 'Admin';
    await createAndSendOTP({ mobile: clean, email, name });

    const masked = `${'*'.repeat(6)}${clean.slice(-4)}`;
    res.json({ success: true, message: `OTP sent to ${masked}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: 'Mobile and OTP required' });

    const clean = normalizeMobile(mobile);
    const { verifyOTP } = require('../services/otpService');
    const result = await verifyOTP({ mobile: clean, otp });
    if (!result.success) return res.status(400).json({ success: false, message: result.message });

    // Find user: first by mobile, then any admin as fallback (for settings-only auth)
    let user = await User.findOne({ mobile: { $in: [clean, `91${clean}`, `+91${clean}`] } });
    if (!user) user = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    if (!user) return res.status(404).json({ success: false, message: 'No admin user found' });

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
    // Only count real leads (with mobile number captured)
    const R = { mobile: { $exists: true, $nin: [null, ''] } };

    const [totalLeads, todayLeads, weekLeads, verifiedLeads, hotLeads, priorityLeads, siteVisits, statusCounts, sourceStats, projectStats, locationStats, activeProjects, publishedBlogs] = await Promise.all([
      Lead.countDocuments(R),
      Lead.countDocuments({ ...R, createdAt: { $gte: today } }),
      Lead.countDocuments({ ...R, createdAt: { $gte: weekAgo } }),
      Lead.countDocuments({ ...R, isVerified: true }),
      Lead.countDocuments({ ...R, status: 'Hot' }),
      Lead.countDocuments({ ...R, status: 'Priority' }),
      Lead.countDocuments({ ...R, siteVisitRequested: true }),
      Lead.aggregate([{ $match: R }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $match: R }, { $group: { _id: '$utmSource', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Lead.aggregate([{ $match: { ...R, interestedProject: { $ne: null } } }, { $group: { _id: '$interestedProject', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Lead.aggregate([{ $match: { ...R, preferredLocation: { $ne: null } } }, { $group: { _id: '$preferredLocation', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Project.countDocuments({ isActive: true }),
      Blog.countDocuments({ status: 'published' }),
    ]);

    res.json({
      success: true,
      data: {
        overview: { totalLeads, todayLeads, weekLeads, verifiedLeads, hotLeads, priorityLeads, siteVisits, activeProjects, publishedBlogs },
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
    const { status, page = 1, limit = 20, search, utmSource, projectSlug, location, sort = '-createdAt', includeAnonymous } = req.query;

    // By default only show real leads (those with a mobile number captured)
    const query = includeAnonymous === 'true'
      ? {}
      : { mobile: { $exists: true, $nin: [null, ''] } };

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

// ─── Export Leads as CSV ─────────────────────────────────────────────────────
router.get('/leads/export', protect, async (req, res) => {
  try {
    const { status, search, from, to } = req.query;
    const query = { mobile: { $exists: true, $nin: [null, ''] } };
    if (status) query.status = status;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) { const toDate = new Date(to); toDate.setHours(23, 59, 59); query.createdAt.$lte = toDate; }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort('-createdAt').limit(10000).lean();

    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const headers = ['Name', 'Mobile', 'Email', 'Budget', 'Preferred Location', 'Buying Purpose', 'Timeline', 'Interested Project', 'Score', 'Status', 'Verified', 'WhatsApp Consent', 'Source Page', 'UTM Source', 'UTM Campaign', 'Site Visit Requested', 'Created At'];

    const rows = leads.map((l) => [
      escape(l.name),
      escape(l.mobile),
      escape(l.email),
      escape(l.budget),
      escape(l.preferredLocation),
      escape(l.buyingPurpose),
      escape(l.timeline),
      escape(l.interestedProject),
      escape(l.score),
      escape(l.status),
      escape(l.isVerified ? 'Yes' : 'No'),
      escape(l.whatsappConsent ? 'Yes' : 'No'),
      escape(l.sourcePage),
      escape(l.utmSource),
      escape(l.utmCampaign),
      escape(l.siteVisitRequested ? 'Yes' : 'No'),
      escape(new Date(l.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const filename = `leads_${new Date().toISOString().slice(0, 10)}.csv`;

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send('﻿' + csv); // BOM for Excel compatibility
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

    // Emit real-time update to all admin clients
    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('lead:updated', { lead });

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

// ─── CSV Template ────────────────────────────────────────────────────────────
router.get('/projects/csv-template', authorize('admin', 'manager'), (req, res) => {
  const headers = [
    'name', 'slug', 'builder_name', 'builder_logo', 'builder_website',
    'location', 'sector', 'corridor', 'status',
    'priceDisplay', 'pricePerSqft', 'priceMin', 'priceMax',
    'configurations', 'possession', 'totalUnits', 'totalTowers', 'totalArea', 'floors',
    'rera_number', 'shortDescription', 'description',
    'highlights', 'amenities', 'connectivity', 'nearbyLandmarks', 'whyBuy', 'tags',
    'heroImage', 'gallery',
    'appreciationRate', 'rentalYield',
    'isFeatured', 'isNew', 'metaTitle', 'metaDescription',
  ];
  const sample = [
    'Ashiana Anmol Phase 4', 'ashiana-anmol-phase-4-bhiwadi', 'Ashiana Housing', '', 'https://ashianahousing.com',
    'NH-48 Frontage, Bhiwadi', 'Bhiwadi Phase 2', 'NH-48 Corridor', 'New Launch',
    '₹45 L – ₹75 L', '₹4200 – ₹5500', '45', '75',
    '2 BHK (1050 sqft)|3 BHK (1400 sqft)', 'Dec 2027', '450', '4', '6 Acres', 'G+12',
    'RAJ/RERA/2025/GRP/045', 'Premium 2 & 3 BHK on NH-48 Bhiwadi',
    'Ashiana Anmol Phase 4 — trusted builder, NH-48 frontage, high rental demand from RIICO workers.',
    'Swimming Pool|Clubhouse|Gym',
    'Gymnasium|Swimming Pool|Badminton Court|Clubhouse|Children Play Area',
    'NH-48 adjacent|Bhiwadi 3 km|Dharuhera 12 km',
    'City Centre Mall|Ryan International|Fortis Hospital',
    'Ashiana brand — best delivery record in Bhiwadi|High rental demand',
    'nh-48,ashiana,bhiwadi',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    '22–30% (3Y)', '4.5%',
    'true', 'true',
    'Ashiana Anmol Phase 4 Bhiwadi | Price Floor Plans RERA | Property in Bhiwadi',
    'Ashiana Anmol Phase 4 Bhiwadi — 2 BHK from ₹45L on NH-48. RERA verified. Free site visit.',
  ];
  const csv = [headers.join(','), sample.map(v => `"${v}"`).join(',')].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bhiwadi-projects-template.csv"');
  res.send(csv);
});

// ─── CSV Import ───────────────────────────────────────────────────────────────
router.post('/projects/import/csv', authorize('admin', 'manager'), csvUpload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  const results = { created: 0, skipped: 0, errors: [] };
  try {
    const text = req.file.buffer.toString('utf-8');
    const rows = parseCSV(text);
    if (rows.length === 0) return res.status(400).json({ success: false, message: 'CSV is empty or has no data rows' });

    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const skipImages = req.body.skipImages === 'true';
    const splitPipe = (str) => str ? str.split('|').map(s => s.trim()).filter(Boolean) : [];

    for (const row of rows) {
      try {
        if (!row.name || !row.slug) {
          results.errors.push({ row: row.name || '(no name)', error: 'Missing name or slug' });
          results.skipped++; continue;
        }
        const slug = row.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        const existing = await Project.findOne({ slug });
        if (existing) {
          results.errors.push({ row: row.name, error: `Slug "${slug}" already exists — skipped` });
          results.skipped++; continue;
        }

        let heroImage = row.heroImage || row.hero_image || '';
        if (heroImage.startsWith('http') && !skipImages) {
          heroImage = await downloadImageFromUrl(heroImage, baseUrl);
        }

        const galleryRaw = (row.gallery || '').split('|').map(u => u.trim()).filter(Boolean);
        const gallery = [];
        for (const u of galleryRaw) {
          if (u.startsWith('http') && !skipImages) gallery.push(await downloadImageFromUrl(u, baseUrl));
          else if (u) gallery.push(u);
        }

        const statusList = ['New Launch', 'Pre Launch', 'Under Construction', 'Ready To Move'];
        const project = await Project.create({
          name: row.name,
          slug,
          builder: {
            name: row.builder_name || row.builder || '',
            logo: row.builder_logo || '',
            website: row.builder_website || '',
            reraId: row.builder_rera_id || '',
          },
          location: row.location || '',
          sector: row.sector || '',
          corridor: row.corridor || '',
          pincode: row.pincode || '',
          googleMapsUrl: row.googleMapsUrl || row.google_maps_url || '',
          status: statusList.includes(row.status) ? row.status : 'New Launch',
          priceDisplay: row.priceDisplay || row.price_display || '',
          pricePerSqft: row.pricePerSqft || row.price_per_sqft || '',
          priceMin: Number(row.priceMin || row.price_min || 0),
          priceMax: Number(row.priceMax || row.price_max || 0),
          priceOnRequest: row.priceOnRequest === 'true',
          configurations: splitPipe(row.configurations),
          possession: row.possession || '',
          totalUnits: Number(row.totalUnits || row.total_units || 0),
          totalTowers: Number(row.totalTowers || row.total_towers || 0),
          totalArea: row.totalArea || row.total_area || '',
          floors: row.floors || '',
          rera: { number: row.rera_number || row.rera || '', link: row.rera_link || '', expiryDate: row.rera_expiry || '' },
          shortDescription: row.shortDescription || row.short_description || '',
          description: row.description || '',
          highlights: splitPipe(row.highlights),
          amenities: splitPipe(row.amenities),
          connectivity: splitPipe(row.connectivity),
          nearbyLandmarks: splitPipe(row.nearbyLandmarks || row.nearby_landmarks || ''),
          whyBuy: splitPipe(row.whyBuy || row.why_buy || ''),
          tags: splitPipe(row.tags),
          heroImage,
          gallery,
          appreciationRate: row.appreciationRate || row.appreciation_rate || '',
          rentalYield: row.rentalYield || row.rental_yield || '',
          isFeatured: row.isFeatured === 'true' || row.is_featured === 'true',
          isNew: row.isNew === 'true' || row.is_new === 'true',
          isVerified: row.isVerified !== 'false',
          isActive: row.isActive !== 'false',
          isCommercial: row.isCommercial === 'true',
          metaTitle: row.metaTitle || row.meta_title || '',
          metaDescription: row.metaDescription || row.meta_description || '',
          metaKeywords: row.metaKeywords || row.meta_keywords || '',
        });

        // Emit real-time event
        const io = req.app.get('io');
        if (io) io.to('admin-room').emit('project:created', { project });

        results.created++;
      } catch (err) {
        results.errors.push({ row: row.name || '(unknown)', error: err.message });
        results.skipped++;
      }
    }

    res.json({
      success: true,
      message: `Import done: ${results.created} created, ${results.skipped} skipped`,
      results,
    });
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

    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('project:created', { project });

    res.status(201).json({ success: true, data: project });

    // Auto-submit to search engines (fire-and-forget)
    if (project.isActive && project.slug) {
      const SiteSettings = require('../models/SiteSettings');
      SiteSettings.findOne({}).lean().then(s => {
        if (s?.indexingAutoSubmit !== false && s?.googleSearchConsole?.siteUrl) {
          const url = `${s.googleSearchConsole.siteUrl.replace(/\/$/, '')}/projects/${project.slug}`;
          autoSubmit([url]);
        }
      }).catch(() => {});
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/projects/:id', authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('project:updated', { project });

    res.json({ success: true, data: project });

    // Auto-submit to search engines (fire-and-forget)
    if (project?.isActive && project?.slug) {
      const SiteSettings = require('../models/SiteSettings');
      SiteSettings.findOne({}).lean().then(s => {
        if (s?.indexingAutoSubmit !== false && s?.googleSearchConsole?.siteUrl) {
          const url = `${s.googleSearchConsole.siteUrl.replace(/\/$/, '')}/projects/${project.slug}`;
          autoSubmit([url]);
        }
      }).catch(() => {});
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/projects/:id', authorize('admin'), async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('project:deleted', { id: req.params.id });

    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Site Settings ────────────────────────────────────────────────────────────
const SiteSettings = require('../models/SiteSettings');

router.get('/settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({});
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, settings: maskSettings(settings.toObject()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings', authorize('admin'), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({});
    const existingSmtpPass = settings?.smtp?.pass;
    const existingWaToken = settings?.whatsappCloud?.accessToken;

    const body = JSON.parse(JSON.stringify(req.body));

    // Restore sensitive fields if masked value received (not a real change)
    if (body.smtp) {
      if (body.smtp.pass === '••••••••' || body.smtp.pass === '') {
        if (existingSmtpPass) body.smtp.pass = existingSmtpPass;
        else delete body.smtp.pass;
      }
    }
    if (body.whatsappCloud) {
      if (body.whatsappCloud.accessToken === '••••••••' || body.whatsappCloud.accessToken === '') {
        if (existingWaToken) body.whatsappCloud.accessToken = existingWaToken;
        else delete body.whatsappCloud.accessToken;
      }
    }

    if (!settings) {
      settings = new SiteSettings(body);
    } else {
      Object.assign(settings, body);
      settings.markModified('smtp');
      settings.markModified('whatsappCloud');
      settings.markModified('marketStats');
      settings.markModified('social');
      settings.markModified('testimonials');
      settings.markModified('locations');
      settings.markModified('builders');
      settings.markModified('faqs');
      settings.markModified('seoKeywords');
      settings.markModified('logoUrl');
      settings.markModified('faviconUrl');
      settings.markModified('conversion');
      settings.markModified('companyInfo');
    }
    await settings.save();

    // Invalidate in-memory caches so next request picks up new settings
    try {
      require('../services/emailService')._invalidateCache?.();
      require('../services/whatsappService')._invalidateCache?.();
      require('./settings').invalidateSettingsCache?.();
    } catch (_) {}

    // Return masked settings (never expose real password/token)
    res.json({ success: true, settings: maskSettings(settings.toObject()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Test SMTP connection
router.post('/settings/test-smtp', authorize('admin'), async (req, res) => {
  try {
    const { testSmtpConnection } = require('../services/emailService');
    let { host, port, secure, user, pass, from } = req.body;
    if (pass === '••••••••') {
      const s = await SiteSettings.findOne({}).lean();
      pass = s?.smtp?.pass || '';
    }
    await testSmtpConnection({ host, port, secure, user, pass, from });
    res.json({ success: true, message: 'SMTP connection successful! ✅' });
  } catch (err) {
    res.status(400).json({ success: false, message: `SMTP Error: ${err.message}` });
  }
});

// Test WhatsApp Cloud API connection
router.post('/settings/test-whatsapp', authorize('admin'), async (req, res) => {
  try {
    const { testWaConnection } = require('../services/whatsappService');
    let { phoneNumberId, accessToken } = req.body;
    if (accessToken === '••••••••') {
      const s = await SiteSettings.findOne({}).lean();
      accessToken = s?.whatsappCloud?.accessToken || '';
    }
    const result = await testWaConnection({ phoneNumberId, accessToken });
    res.json({ success: true, message: 'WhatsApp Cloud API connected! ✅', data: result.data });
  } catch (err) {
    res.status(400).json({ success: false, message: `WhatsApp Error: ${err.response?.data?.error?.message || err.message}` });
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

// ─── Analytics ───────────────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      utmSources,
      topProjects,
      topLocations,
      budgetDist,
      deviceBreakdown,
      dailyLeads,
      pagesViewed,
      projectsViewed,
      totalLeads,
      verifiedLeads,
    ] = await Promise.all([
      // Lead sources by UTM
      Lead.aggregate([
        { $group: { _id: '$utmSource', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Top projects by interest
      Lead.aggregate([
        { $match: { interestedProject: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$interestedProject', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Top locations
      Lead.aggregate([
        { $match: { preferredLocation: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$preferredLocation', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Budget distribution
      Lead.aggregate([
        { $match: { budget: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$budget', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Device breakdown
      Lead.aggregate([
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      ]),
      // Daily leads for last 30 days
      Lead.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Most viewed pages (unwind pagesViewed array)
      Lead.aggregate([
        { $unwind: '$pagesViewed' },
        { $group: { _id: '$pagesViewed', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      // Most viewed projects (unwind projectsViewed array)
      Lead.aggregate([
        { $unwind: '$projectsViewed' },
        { $group: { _id: '$projectsViewed', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      // Total leads with any score (proxy for visitors who engaged)
      Lead.countDocuments({ score: { $gt: 0 } }),
      // Verified leads
      Lead.countDocuments({ isVerified: true }),
    ]);

    const totalCount = await Lead.countDocuments();

    res.json({
      success: true,
      data: {
        utmSources,
        topProjects,
        topLocations,
        budgetDist,
        deviceBreakdown,
        dailyLeads,
        pagesViewed,
        projectsViewed,
        conversionRate: {
          totalEngaged: totalLeads,
          verified: verifiedLeads,
          total: totalCount,
          rate: totalLeads > 0 ? ((verifiedLeads / totalLeads) * 100).toFixed(1) : '0',
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Google Search Console ────────────────────────────────────────────────────
// ── Helper: build GSC auth from either service_account or authorized_user JSON ─
function buildGscAuth(google, credJson) {
  const credentials = { ...credJson };

  if (credentials.type === 'authorized_user') {
    // quota_project_id is required for user OAuth2 credentials
    // it must match the GCP project where Search Console API is enabled
    if (!credentials.quota_project_id) {
      credentials.quota_project_id = 'new-projects-seo';
    }
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

router.post('/gsc/verify', authorize('admin'), async (req, res) => {
  try {
    const { siteUrl, serviceAccountJson } = req.body;
    if (!siteUrl || !serviceAccountJson) {
      return res.status(400).json({ success: false, message: 'siteUrl and serviceAccountJson required' });
    }

    let credJson;
    try {
      credJson = JSON.parse(serviceAccountJson);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON' });
    }

    let google;
    try { ({ google } = require('googleapis')); }
    catch { return res.status(500).json({ success: false, message: 'Run: npm install googleapis in backend.' }); }

    const auth = buildGscAuth(google, credJson);
    const webmasters = google.webmasters({ version: 'v3', auth });

    const sitesResp = await webmasters.sites.list();
    const sites = sitesResp.data.siteEntry || [];
    const found = sites.find((s) => s.siteUrl === siteUrl || s.siteUrl === siteUrl + '/');

    if (!found) {
      return res.status(400).json({
        success: false,
        message: `Site "${siteUrl}" not found. Available sites: ${sites.map(s => s.siteUrl).join(', ') || 'none'}`,
        availableSites: sites.map((s) => s.siteUrl),
      });
    }

    await SiteSettings.findOneAndUpdate(
      {},
      { $set: { 'googleSearchConsole.siteUrl': siteUrl, 'googleSearchConsole.serviceAccountJson': serviceAccountJson, 'googleSearchConsole.connected': true } },
      { upsert: true }
    );

    res.json({ success: true, message: `GSC connected! Property: ${found.siteUrl}`, siteUrl: found.siteUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data?.error?.message || err.message });
  }
});

router.get('/gsc/data', authorize('admin'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({}).lean();
    if (!settings?.googleSearchConsole?.connected || !settings?.googleSearchConsole?.serviceAccountJson) {
      return res.status(400).json({ success: false, message: 'GSC not connected. Configure in Settings tab first.' });
    }

    let google;
    try {
      ({ google } = require('googleapis'));
    } catch {
      return res.status(500).json({ success: false, message: 'googleapis package not installed. Run: npm install googleapis in backend.' });
    }

    let credJson;
    try {
      credJson = JSON.parse(settings.googleSearchConsole.serviceAccountJson);
    } catch {
      return res.status(500).json({ success: false, message: 'Stored GSC credentials are invalid JSON.' });
    }

    const auth = buildGscAuth(google, credJson);
    const searchconsole = google.webmasters({ version: 'v3', auth });
    const siteUrl = settings.googleSearchConsole.siteUrl;

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [queriesResp, pagesResp, countriesResp] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        resource: { startDate, endDate, dimensions: ['query'], rowLimit: 10 },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        resource: { startDate, endDate, dimensions: ['page'], rowLimit: 10 },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        resource: { startDate, endDate, dimensions: ['country'], rowLimit: 10 },
      }),
    ]);

    res.json({
      success: true,
      data: {
        queries: queriesResp.data.rows || [],
        pages: pagesResp.data.rows || [],
        countries: countriesResp.data.rows || [],
        dateRange: { startDate, endDate },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data?.error?.message || err.message });
  }
});

module.exports = router;
