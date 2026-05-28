require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');

const app = express();
const httpServer = http.createServer(app);

// ─── Socket.io Setup ─────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Make io accessible to routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Admin connected: ${socket.id}`);
  socket.join('admin-room');
  socket.on('disconnect', () => {
    console.log(`🔌 Admin disconnected: ${socket.id}`);
  });
});

app.set('trust proxy', 1);
app.disable('x-powered-by');

// ─── Connect Database ────────────────────────────────────────────────────────
connectDB().then(async () => {
  try {
    const Project = require('./models/Project');
    const SiteSettings = require('./models/SiteSettings');
    const { seedProjects, seedSettings } = require('./utils/seedData');

    const [projectCount, settingsCount] = await Promise.all([
      Project.countDocuments(),
      SiteSettings.countDocuments(),
    ]);

    if (projectCount === 0) {
      console.log('\n📦 First run — auto-seeding projects…');
      await seedProjects();
    }
    if (settingsCount === 0) {
      console.log('⚙️  Seeding default site settings…');
      await seedSettings();
    }
  } catch (e) {
    console.error('Auto-seed skipped:', e.message);
  }
});

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(compression());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Uploaded Images ──────────────────────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public/uploads'), {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests',
});

const otpLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many OTP requests',
});

app.use('/api/', generalLimit);
app.use('/api/leads/send-otp', otpLimit);
app.use('/api/admin/send-otp', otpLimit);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/leads', require('./routes/leads'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Server error'
        : err.message,
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5007;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 API Local: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`🖼️ Uploads: http://localhost:${PORT}/uploads`);
  console.log(`❤️  Health: http://localhost:${PORT}/health\n`);
});

module.exports = { app, io };
