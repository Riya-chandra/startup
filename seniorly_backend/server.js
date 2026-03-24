require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

connectDB();

const app = express();

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'startup-26n8215sm-xxxs-projects-056b9225.vercel.app',
  process.env.CLIENT_URL,
  process.env.ADMIN_CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

const limiter     = rateLimit({ windowMs: 15*60*1000, max: 100, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10  });
app.use('/api/',               limiter);
app.use('/api/users/login',    authLimiter);
app.use('/api/users/register', authLimiter);

// ── Body parser ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({
  success: true, app: 'Seniorly API', version: '1.0.0',
  status: 'OK', timestamp: new Date().toISOString(),
}));

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/webinars',    require('./routes/webinarRoutes'));
app.use('/api/sessions',    require('./routes/sessionRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/emails',      require('./routes/emailRoutes'));
app.use('/api/admin',       require('./routes/adminRoutes'));

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, errors: msgs });
  }
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, message: 'Invalid token' });

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  Seniorly API started`);
  console.log(`    Port:    ${PORT}`);
  console.log(`    Mode:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`    Health:  http://localhost:${PORT}/health\n`);
});

module.exports = app;
