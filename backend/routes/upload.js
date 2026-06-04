const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed (jpg, png, webp, gif)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // 5MB per file, max 10 files
});

// POST /api/upload/single  — single image upload
router.post('/single', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      url: `${baseUrl}/api/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  });
});

// POST /api/upload/gallery  — multiple images upload (max 10)
router.post('/gallery', protect, (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      urls: req.files.map((f) => `${baseUrl}/api/uploads/${f.filename}`),
      count: req.files.length,
    });
  });
});

// DELETE /api/upload/:filename — delete uploaded file
router.delete('/:filename', protect, (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found' });
  fs.unlinkSync(filePath);
  res.json({ success: true, message: 'File deleted' });
});

module.exports = router;
