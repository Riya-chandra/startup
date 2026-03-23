const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const Session            = require('../models/Session');
const CourseNotification = require('../models/CourseNotification');
const { protect, authorize } = require('../middleware/auth');
const { sendCourseNotificationAlert } = require('../utils/emailService');

// ── GET /api/sessions  — all upcoming/live, public ────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status = 'upcoming', level, earlyBird, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (status)    filter.status    = status;
    if (level)     filter.level     = level;
    if (earlyBird === 'true') filter.isEarlyBird = true;

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .populate('instructor', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit),
      Session.countDocuments(filter),
    ]);
    res.json({ success: true, data: sessions, pagination: { page: +page, limit: +limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/sessions/:id ─────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('instructor', 'firstName lastName avatar bio');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: { ...session.toObject(), seatsLeft: session.seatsLeft } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/sessions  — admin/instructor ────────────────────────────────
router.post('/', protect, authorize('admin', 'instructor'), [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('level').isIn(['Beginner','Intermediate','Advanced','Beginner to Advanced']),
  body('price').optional().isNumeric(),
  body('seatsLimit').optional().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const session = await Session.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/sessions/:id ─────────────────────────────────────────────────
router.put('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/sessions/:id ──────────────────────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/sessions/:id/notify  — "Notify Me" button ──────────────────
router.post('/:id/notify', [
  body('email').isEmail().withMessage('Valid email required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const { email } = req.body;

    // Add to session's notifyList if not already there
    if (!session.notifyList.includes(email)) {
      session.notifyList.push(email);
      await session.save();
    }

    // Also save in CourseNotification for detailed tracking
    await CourseNotification.findOneAndUpdate(
      { email, courseTitle: session.title },
      { email, courseTitle: session.title, notificationType: 'launch', status: 'pending', preferences: { emailNotification: true, notifyOnLaunch: true } },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: `You'll be notified when "${session.title}" launches!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/sessions/:id/launch  — admin fires notification emails ──────
router.post('/:id/launch', protect, authorize('admin'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.status = 'live';
    await session.save();

    const notifications = await CourseNotification.find({ courseTitle: session.title, status: 'pending' });
    const sessionUrl = `${process.env.CLIENT_URL}/sessions/${session.slug}`;
    let sent = 0;

    await Promise.allSettled(notifications.map(async (n) => {
      await sendCourseNotificationAlert({ email: n.email, courseTitle: session.title, courseUrl: sessionUrl, launchDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) });
      n.status = 'notified';
      n.notifiedAt = new Date();
      await n.save();
      sent++;
    }));

    res.json({ success: true, message: `Session launched. Notified ${sent} subscribers.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/sessions/:id/notify-count — how many waiting ────────────────
router.get('/:id/notify-count', protect, authorize('admin'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, count: session.notifyList.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
