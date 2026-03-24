const express = require('express');
const { body, validationResult } = require('express-validator');

const { protect, authorize } = require('../middleware/auth');
const Session = require('../models/Session');
const Webinar = require('../models/Webinar');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

router.use(protect, authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [users, sessions, webinars, enrollments] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments(),
      Webinar.countDocuments(),
      Enrollment.countDocuments(),
    ]);

    const [liveSessions, upcomingSessions, publishedWebinars] = await Promise.all([
      Session.countDocuments({ status: 'live' }),
      Session.countDocuments({ status: 'upcoming' }),
      Webinar.countDocuments({ status: 'published' }),
    ]);

    res.json({
      success: true,
      data: {
        totals: { users, sessions, webinars, enrollments },
        highlights: { liveSessions, upcomingSessions, publishedWebinars },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/sessions
router.post(
  '/sessions',
  [
    body('title').trim().notEmpty().withMessage('Title required'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced']),
    body('status').optional().isIn(['upcoming', 'live', 'completed', 'cancelled']),
    body('price').optional().isNumeric(),
    body('seatsLimit').optional().isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const session = await Session.create({
        ...req.body,
        instructor: req.body.instructor || req.user._id,
      });
      res.status(201).json({ success: true, data: session });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/admin/sessions/:id/status
router.patch(
  '/sessions/:id/status',
  [body('status').isIn(['upcoming', 'live', 'completed', 'cancelled'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const session = await Session.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
      res.json({ success: true, data: session });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/admin/sessions/:id
router.delete('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/webinars
router.get('/webinars', async (req, res) => {
  try {
    const webinars = await Webinar.find()
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: webinars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/webinars/:id/status
router.patch(
  '/webinars/:id/status',
  [body('status').isIn(['draft', 'published', 'archived'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const webinar = await Webinar.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
      res.json({ success: true, data: webinar });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/admin/webinars/:id
router.delete('/webinars/:id', async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndDelete(req.params.id);
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    res.json({ success: true, message: 'Webinar deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id/role
router.patch(
  '/users/:id/role',
  [body('role').isIn(['student', 'instructor', 'admin'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role: req.body.role },
        { new: true, runValidators: true }
      );
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ success: false, message: 'isActive must be boolean' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
