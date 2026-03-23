const mongoose = require('mongoose');

const webinarSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  instructor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  shortDesc:   { type: String },
  level:       { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'], default: 'Beginner' },
  duration:    { type: String, default: '1 hour' },   // e.g. "1 hour", "2 hours"
  isFree:      { type: Boolean, default: true },
  status:      { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  thumbnail:   { type: String, default: '' },
  whatYoullLearn: [{ type: String }],
  hasCertificate: { type: Boolean, default: true },
  enrollmentCount: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 },
  },
  scheduledAt:  { type: Date },
  recordingUrl: { type: String },
}, { timestamps: true });

webinarSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Webinar', webinarSchema);
