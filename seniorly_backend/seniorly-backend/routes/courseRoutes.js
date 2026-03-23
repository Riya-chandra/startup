const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/courses ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 12, category, level, free,
      search, sort = '-createdAt',
    } = req.query;

    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (level)    filter.level    = level;
    if (free === 'true') filter.isFree = true;
    if (search)   filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('instructor', 'firstName lastName avatar')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-sections'),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/courses/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName avatar bio');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/courses ──────────────────────────────────────────────────────
router.post('/', protect, authorize('instructor', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['development','design','data','business','marketing','other']).withMessage('Invalid category'),
  body('level').isIn(['Beginner','Intermediate','Advanced']).withMessage('Invalid level'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const course = await Course.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/courses/:id ───────────────────────────────────────────────────
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Instructors can only edit their own courses
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised to edit this course' });

    // Auto set publishedAt on first publish
    if (req.body.status === 'published' && course.status !== 'published')
      req.body.publishedAt = new Date();

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/courses/:id ────────────────────────────────────────────────
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised' });

    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/courses/slug/:slug ────────────────────────────────────────────
router.get('/slug/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', 'firstName lastName avatar bio');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
