require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('../models/User');
const Webinar = require('../models/Webinar');
const Session = require('../models/Session');
const Enrollment = require('../models/Enrollment');
const EmailSubscription = require('../models/EmailSubscription');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear all
  await Promise.all([
    User.deleteMany(), Webinar.deleteMany(), Session.deleteMany(),
    Enrollment.deleteMany(), EmailSubscription.deleteMany(),
  ]);
  console.log('🗑  Cleared existing data');

  // ── Admin ───────────────────────────────────────────────────────────────
  const admin = await User.create({
    firstName: 'Admin', lastName: 'Seniorly',
    email: process.env.ADMIN_EMAIL || 'admin@seniorly.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin', isVerified: true,
  });

  // ── Instructors ──────────────────────────────────────────────────────────
  const [mukul, priyanshu] = await User.insertMany([
    { firstName: 'Mukul', lastName: 'Preethi', email: 'mukul@seniorly.com', password: 'Instructor@123', role: 'instructor', isVerified: true, bio: "I'm an Issue and Problem Solver" },
    { firstName: 'Priyanshu', lastName: 'Singh', email: 'priyanshu@seniorly.com', password: 'Instructor@123', role: 'instructor', isVerified: true, bio: 'Start your college journey on the right foot' },
  ]);

  // ── Webinars (Free) ──────────────────────────────────────────────────────
  const webinars = await Webinar.insertMany([
    {
      title: 'Introduction to Seniorly',
      instructor: mukul._id,
      description: "I'm an Issue and Problem Solver",
      shortDesc: "I'm an Issue and Problem Solver",
      level: 'Beginner', duration: '1 hour',
      isFree: true, status: 'published',
      whatYoullLearn: ['Who we are', 'What we do', 'What you get'],
      hasCertificate: true,
      enrollmentCount: 2400,
      rating: { average: 4.8, count: 312 },
    },
    {
      title: 'The Beginners',
      instructor: priyanshu._id,
      description: 'Start your college journey on the right foot',
      shortDesc: 'Start your college journey on the right foot',
      level: 'Beginner', duration: '1 hour',
      isFree: true, status: 'published',
      whatYoullLearn: ['Resource Database', 'Mentor Insights', 'Management Tips'],
      hasCertificate: true,
      enrollmentCount: 1800,
      rating: { average: 4.7, count: 198 },
    },
    {
      title: 'Upcoming...',
      instructor: null,
      description: 'Coming soon',
      level: 'Beginner', duration: '0 hours',
      isFree: true, status: 'published',
      whatYoullLearn: [],
      hasCertificate: true,
      enrollmentCount: 0,
      rating: { average: 4.6, count: 0 },
    },
  ]);

  // ── Upcoming Sessions ─────────────────────────────────────────────────────
  const sessions = await Session.insertMany([
    {
      title: 'Types of Development',
      level: 'Beginner', status: 'upcoming', launchLabel: 'Launching Soon',
      prerequisites: ['Find your path in dev'],
      whatYoullLearn: ['What is Development', 'Types of Development'],
      courseFeatures: ['Live Session', 'Razma', 'Certification'],
      price: 400, seatsLimit: 120, isEarlyBird: false,
    },
    {
      title: 'Knowing Fundamentals',
      level: 'Beginner', status: 'upcoming', launchLabel: 'Launching Soon',
      prerequisites: ['Own a little corner'],
      whatYoullLearn: ['Core concepts'],
      courseFeatures: ['Live Session', 'Live Mentorship', 'Certification'],
      price: 400, seatsLimit: 500, isEarlyBird: false,
    },
    {
      title: 'Revealing Soon',
      level: 'Beginner to Advanced', status: 'upcoming', launchLabel: 'Launching Soon',
      prerequisites: ['Role', 'Creator'],
      whatYoullLearn: ['—'],
      courseFeatures: ['Live Session', 'Live Mentorship', 'Certification'],
      price: 400, seatsLimit: 400, isEarlyBird: true,
    },
    {
      title: 'Soon...',
      level: 'Intermediate', status: 'upcoming', launchLabel: 'Launching Soon',
      prerequisites: ['—'],
      courseFeatures: ['Live Session', 'Razma', 'Certification'],
      price: 400, seatsLimit: 110, isEarlyBird: false,
    },
    {
      title: 'Soon...',
      level: 'Intermediate', status: 'upcoming', launchLabel: 'Launching Soon',
      prerequisites: ['—'],
      courseFeatures: ['Live Session', 'Live Mentorship', 'Certification'],
      price: 400, seatsLimit: 400, isEarlyBird: true,
    },
    {
      title: 'Soon...',
      level: 'Advanced', status: 'upcoming', launchLabel: 'Launching Soon',
      prerequisites: ['—'],
      courseFeatures: ['Live Session', 'Certification'],
      price: 400, seatsLimit: 250, isEarlyBird: false,
    },
  ]);

  // ── Sample students ──────────────────────────────────────────────────────
  const students = await User.insertMany([
    { firstName: 'Aman',   lastName: 'Kapoor', email: 'aman@example.com',   password: 'Student@123', role: 'student', isVerified: true },
    { firstName: 'Sneha',  lastName: 'Singh',  email: 'sneha@example.com',  password: 'Student@123', role: 'student', isVerified: true },
  ]);

  // ── Sample enrollments ───────────────────────────────────────────────────
  await Enrollment.insertMany([
    { student: students[0]._id, webinar: webinars[0]._id, status: 'active',     amountPaid: 0, paymentMethod: 'free' },
    { student: students[0]._id, webinar: webinars[1]._id, status: 'completed',  amountPaid: 0, paymentMethod: 'free', completedAt: new Date(), certificate: { issued: true, certificateId: 'SNRLY-A1B2' } },
    { student: students[1]._id, webinar: webinars[0]._id, status: 'active',     amountPaid: 0, paymentMethod: 'free' },
  ]);

  // ── Sample newsletter subscribers ────────────────────────────────────────
  await EmailSubscription.insertMany([
    { email: 'subscriber1@example.com', firstName: 'Rahul', status: 'active', isConfirmed: true },
    { email: 'subscriber2@example.com', firstName: 'Priya', status: 'active', isConfirmed: true },
  ]);

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────');
  console.log(`Admin:       ${admin.email}  /  ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  console.log(`Instructor:  mukul@seniorly.com  /  Instructor@123`);
  console.log(`Student:     aman@example.com  /  Student@123`);
  console.log(`Webinars:    ${webinars.length} published`);
  console.log(`Sessions:    ${sessions.length} upcoming`);
  console.log('─────────────────────────────────\n');

  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
