const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
      headers: { 'User-Agent': 'Mozilla/5.0 GurgaonRealtyBot/1.0' },
    });
    const writer = fs.createWriteStream(filepath);
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    return `${baseUrl}/uploads/${filename}`;
  } catch (err) {
    console.error(`Image download failed (${url}):`, err.message);
    return url; // keep original on failure
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
    'Sobha City Gurgaon', 'sobha-city-gurgaon', 'Sobha Limited', '', 'https://sobha.com',
    'Sector 108 Dwarka Expressway', 'Sector 108', 'Dwarka Expressway', 'New Launch',
    '₹1.8 Cr – ₹3.5 Cr', '₹8500 – ₹10200', '180', '350',
    '3 BHK (1800 sqft)|4 BHK (2500 sqft)', 'Dec 2026', '1200', '8', '25 Acres', 'G+38',
    'RC/REP/HARERA/GGM/123', 'Premium 3 & 4 BHK on Dwarka Expressway',
    'Sobha City Gurgaon is a landmark luxury residential project by Sobha Limited.',
    'Smart home tech|Skybridge clubhouse|Olympic pool',
    'Gymnasium|Swimming Pool|Tennis Court|Clubhouse|Children Play Area',
    'IGI Airport 15 min|Cyber City 20 min|NH-48 3 min',
    'Ambience Mall|Udyog Vihar|Rajiv Chowk',
    'Top RERA builder|Proven delivery record',
    'luxury,dwarka-expressway',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    '35–45% (3Y)', '3.8%',
    'true', 'true',
    'Sobha City Gurgaon | Price Floor Plans RERA | GurgaonRealty',
    'Sobha City by Sobha Limited in Sector 108. 3 & 4 BHK from ₹1.8 Cr.',
  ];
  const csv = [headers.join(','), sample.map(v => `"${v}"`).join(',')].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="gurgaonrealty-projects-template.csv"');
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
        await Project.create({
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

// ─── Site Settings ────────────────────────────────────────────────────────────
const SiteSettings = require('../models/SiteSettings');

router.get('/settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({});
    if (!settings) settings = await SiteSettings.create({});
    // Never return SMTP password or WA token in plain text — mask them
    const obj = settings.toObject();
    if (obj.smtp?.pass) obj.smtp.pass = '••••••••';
    if (obj.whatsappCloud?.accessToken) obj.whatsappCloud.accessToken = '••••••••';
    res.json({ success: true, settings: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings', authorize('admin'), async (req, res) => {
  try {
    const update = req.body;
    if (update.smtp?.pass === '••••••••') delete update.smtp.pass;
    if (update.whatsappCloud?.accessToken === '••••••••') delete update.whatsappCloud.accessToken;

    const settings = await SiteSettings.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true });

    // Invalidate in-memory caches so next request picks up new settings
    try {
      require('../services/emailService')._invalidateCache?.();
      require('../services/whatsappService')._invalidateCache?.();
    } catch (_) {}

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Test SMTP connection
router.post('/settings/test-smtp', authorize('admin'), async (req, res) => {
  try {
    const { testSmtpConnection } = require('../services/emailService');
    // If password is masked, load from DB
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

module.exports = router;
