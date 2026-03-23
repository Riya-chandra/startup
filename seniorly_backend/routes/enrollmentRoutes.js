const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendEnrollmentConfirmation, sendCertificateEmail } = require('../utils/emailService');

// ── POST /api/enrollments/enroll ───────────────────────────────────────────
router.post('/enroll', [
  body('email').isEmail().withMessage('Valid email required'),
  body('courseId').notEmpty().withMessage('Course ID required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, courseId, paymentMethod = 'free', transactionId, source = 'website' } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.status !== 'published') return res.status(400).json({ success: false, message: 'Course not available' });

    // Find or handle guest enroll
    let student = await User.findOne({ email });
    if (!student) {
      // Guest enrollment: create minimal user
      const nameParts = (req.body.name || 'Guest User').split(' ');
      student = await User.create({
        firstName: nameParts[0],
        lastName:  nameParts[1] || '',
        email,
        password:  uuidv4(), // random, they'll reset if needed
        role: 'student',
      });
    }

    // Check already enrolled
    const existing = await Enrollment.findOne({ student: student._id, course: courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({
      student: student._id,
      course: courseId,
      paymentMethod,
      amountPaid: course.isFree ? 0 : course.price.current,
      transactionId,
      source,
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    // Send confirmation email (non-blocking)
    const courseUrl = `${process.env.CLIENT_URL}/courses/${course.slug}`;
    sendEnrollmentConfirmation({
      email,
      firstName: student.firstName,
      courseTitle: course.title,
      courseUrl,
    }).catch(console.error);

    res.status(201).json({ success: true, data: enrollment, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/enrollments/my-courses ───────────────────────────────────────
router.get('/my-courses', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title thumbnail category level totalDuration rating')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/enrollments/:id/progress ─────────────────────────────────────
router.put('/:id/progress', protect, [
  body('lectureId').notEmpty().withMessage('Lecture ID required'),
  body('timeSpent').optional().isNumeric(),
], async (req, res) => {
  try {
    const { lectureId, timeSpent = 0 } = req.body;
    const enrollment = await Enrollment.findById(req.params.id).populate('course');

    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    if (enrollment.student.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised' });

    // Add lecture to completed if not already there
    if (!enrollment.progress.completedLectures.includes(lectureId)) {
      enrollment.progress.completedLectures.push(lectureId);
    }
    enrollment.progress.totalTimeSpent += timeSpent;
    enrollment.progress.lastAccessedAt = new Date();

    // Recalculate percentage
    const totalLectures = enrollment.course.totalLectures || 1;
    enrollment.progress.percentageCompleted = Math.round(
      (enrollment.progress.completedLectures.length / totalLectures) * 100
    );

    // Auto-complete
    if (enrollment.progress.percentageCompleted >= 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();

      // Issue certificate
      if (!enrollment.certificate.issued) {
        enrollment.certificate.issued = true;
        enrollment.certificate.certificateId = `SNRLY-${uuidv4().slice(0,8).toUpperCase()}`;
        enrollment.certificate.issuedAt = new Date();
        enrollment.certificate.downloadUrl = `${process.env.CLIENT_URL}/certificates/${enrollment.certificate.certificateId}`;

        // Send certificate email (non-blocking)
        const student = await User.findById(req.user._id);
        sendCertificateEmail({
          email: student.email,
          firstName: student.firstName,
          courseTitle: enrollment.course.title,
          certificateUrl: enrollment.certificate.downloadUrl,
        }).catch(console.error);
      }
    }

    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/enrollments/:id/review ──────────────────────────────────────
router.post('/:id/review', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('comment').optional().isLength({ max: 1000 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    if (enrollment.student.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised' });
    if (enrollment.status !== 'completed')
      return res.status(400).json({ success: false, message: 'Complete the course before reviewing' });

    enrollment.review = { rating: req.body.rating, comment: req.body.comment };
    await enrollment.save();

    // Recalculate course rating
    const allReviews = await Enrollment.find({ course: enrollment.course, 'review.rating': { $exists: true } });
    const avg = allReviews.reduce((sum, e) => sum + e.review.rating, 0) / allReviews.length;
    await Course.findByIdAndUpdate(enrollment.course, {
      'rating.average': Math.round(avg * 10) / 10,
      'rating.count':   allReviews.length,
    });

    res.json({ success: true, data: enrollment, message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/enrollments/stats (admin) ────────────────────────────────────
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, completed, thisMonth] = await Promise.all([
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'completed' }),
      Enrollment.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
    ]);
    res.json({ success: true, data: { total, completed, thisMonth, completionRate: Math.round((completed / total) * 100) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
