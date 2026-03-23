const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const EmailSubscription = require('../models/EmailSubscription');
const CourseNotification = require('../models/CourseNotification');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const { sendNewsletterConfirmation, sendCourseNotificationAlert } = require('../utils/emailService');

// ── POST /api/emails/subscribe ─────────────────────────────────────────────
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email required'),
  body('subscriptionType').optional().isIn(['newsletter','course_notifications','all']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, firstName, subscriptionType = 'newsletter', interests = [], source = 'website' } = req.body;

    let sub = await EmailSubscription.findOne({ email });
    if (sub) {
      if (sub.status === 'active') return res.json({ success: true, message: 'Already subscribed' });
      // Re-subscribe
      sub.status = 'pending';
      sub.subscriptionType = subscriptionType;
      if (firstName) sub.firstName = firstName;
    } else {
      const confirmToken = crypto.randomBytes(32).toString('hex');
      const unsubscribeToken = crypto.randomBytes(32).toString('hex');
      sub = new EmailSubscription({ email, firstName, subscriptionType, interests, source, confirmToken, unsubscribeToken });
    }

    await sub.save();

    const confirmUrl = `${process.env.CLIENT_URL}/confirm-subscription/${sub.confirmToken}`;
    sendNewsletterConfirmation({ email, confirmUrl }).catch(console.error);

    res.status(201).json({ success: true, message: 'Check your email to confirm your subscription' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/emails/confirm/:token ────────────────────────────────────────
router.get('/confirm/:token', async (req, res) => {
  try {
    const sub = await EmailSubscription.findOne({ confirmToken: req.params.token });
    if (!sub) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    sub.isConfirmed = true;
    sub.status = 'active';
    sub.confirmToken = undefined;
    await sub.save();

    res.json({ success: true, message: 'Subscription confirmed! Welcome to Seniorly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/emails/unsubscribe ───────────────────────────────────────────
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email required'),
], async (req, res) => {
  try {
    const sub = await EmailSubscription.findOne({ email: req.body.email });
    if (!sub) return res.status(404).json({ success: false, message: 'Email not found' });

    sub.status = 'unsubscribed';
    await sub.save();

    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/emails/course-notifications ─────────────────────────────────
router.post('/course-notifications', [
  body('email').isEmail().withMessage('Valid email required'),
  body('courseTitle').notEmpty().withMessage('Course title required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, courseId, courseTitle, notificationType = 'launch', preferences = {} } = req.body;

    let notification = await CourseNotification.findOne({ email, courseTitle });
    if (notification) return res.json({ success: true, message: 'Already registered for notification' });

    notification = await CourseNotification.create({
      email, courseTitle,
      course: courseId || undefined,
      notificationType,
      preferences: { emailNotification: true, notifyOnLaunch: true, ...preferences },
    });

    res.status(201).json({ success: true, data: notification, message: "You'll be notified when this course launches" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/emails/send-course-alert (admin) ────────────────────────────
// Trigger notification emails when a course launches
router.post('/send-course-alert', protect, authorize('admin'), [
  body('courseId').notEmpty(),
], async (req, res) => {
  try {
    const course = await Course.findById(req.body.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const notifications = await CourseNotification.find({
      $or: [{ course: course._id }, { courseTitle: course.title }],
      status: 'pending',
    });

    const courseUrl = `${process.env.CLIENT_URL}/courses/${course.slug}`;
    let sent = 0;

    await Promise.allSettled(notifications.map(async (n) => {
      await sendCourseNotificationAlert({
        email: n.email,
        courseTitle: course.title,
        courseUrl,
        launchDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      });
      n.status = 'notified';
      n.notifiedAt = new Date();
      await n.save();
      sent++;
    }));

    res.json({ success: true, message: `Notified ${sent} subscribers` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/emails/subscribers (admin) ───────────────────────────────────
router.get('/subscribers', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const [subs, total] = await Promise.all([
      EmailSubscription.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit),
      EmailSubscription.countDocuments(filter),
    ]);
    res.json({ success: true, data: subs, pagination: { page: +page, limit: +limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
