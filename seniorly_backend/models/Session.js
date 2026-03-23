const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  instructor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  level:       { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'], default: 'Beginner' },
  status:      { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  launchLabel: { type: String, default: 'Launching Soon' },  // display label
  launchDate:  { type: Date },
  thumbnail:   { type: String, default: '' },
  prerequisites:   [{ type: String }],
  whatYoullLearn:  [{ type: String }],
  courseFeatures:  [{ type: String, enum: ['Live Session', 'Live Mentorship', 'Certification', 'Razma', 'Community Access'] }],
  price:       { type: Number, default: 400 },
  seatsLimit:  { type: Number, default: 200 },
  seatsBooked: { type: Number, default: 0 },
  isEarlyBird: { type: Boolean, default: false },
  earlyBirdDeadline: { type: Date },
  // notification list — all emails who clicked "Notify Me"
  notifyList:  [{ type: String }],   // simple email array; full model in CourseNotification
}, { timestamps: true });

sessionSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

sessionSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, this.seatsLimit - this.seatsBooked);
});

module.exports = mongoose.model('Session', sessionSchema);
