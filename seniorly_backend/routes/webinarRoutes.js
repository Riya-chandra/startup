const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const Webinar    = require('../models/Webinar');
const Enrollment = require('../models/Enrollment');
const User       = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendEnrollmentConfirmation } = require('../utils/emailService');

// ── GET /api/webinars  — public, all published ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { level, free, page = 1, limit = 12 } = req.query;
    const filter = { status: 'published' };
    if (level) filter.level = level;
    if (free === 'true') filter.isFree = true;

    const [webinars, total] = await Promise.all([
      Webinar.find(filter)
        .populate('instructor', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit),
      Webinar.countDocuments(filter),
    ]);
    res.json({ success: true, data: webinars, pagination: { page: +page, limit: +limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/webinars/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id).populate('instructor', 'firstName lastName avatar bio');
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    res.json({ success: true, data: webinar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/webinars  — admin/instructor ────────────────────────────────
router.post('/', protect, authorize('admin', 'instructor'), [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('level').isIn(['Beginner','Intermediate','Advanced','Beginner to Advanced']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const webinar = await Webinar.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, data: webinar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/webinars/:id ─────────────────────────────────────────────────
router.put('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    res.json({ success: true, data: webinar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/webinars/:id ──────────────────────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Webinar.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Webinar deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/webinars/:id/enroll — guest or logged-in ───────────────────
router.post('/:id/enroll', [
  body('email').isEmail().withMessage('Valid email required'),
  body('name').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar || webinar.status !== 'published')
      return res.status(404).json({ success: false, message: 'Webinar not available' });

    const { email, name = 'Student' } = req.body;
    let student = await User.findOne({ email });
    if (!student) {
      const [firstName, ...rest] = name.split(' ');
      const { v4: uuidv4 } = require('uuid');
      student = await User.create({ firstName, lastName: rest.join(' ') || '', email, password: uuidv4(), role: 'student' });
    }

    const existing = await Enrollment.findOne({ student: student._id, webinar: webinar._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled' });

    await Enrollment.create({ student: student._id, webinar: webinar._id, amountPaid: 0, paymentMethod: 'free' });
    await Webinar.findByIdAndUpdate(req.params.id, { $inc: { enrollmentCount: 1 } });

    sendEnrollmentConfirmation({ email, firstName: student.firstName, courseTitle: webinar.title, courseUrl: `${process.env.CLIENT_URL}/webinars/${webinar.slug}` }).catch(console.error);

    res.status(201).json({ success: true, message: `Enrolled in "${webinar.title}" successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
