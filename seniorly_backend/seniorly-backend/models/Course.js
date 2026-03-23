const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  videoUrl:    { type: String },
  duration:    { type: Number, default: 0 }, // in minutes
  isPreview:   { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
});

const sectionSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  order:    { type: Number, default: 0 },
  lectures: [lectureSchema],
});

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String, required: true },
  shortDesc:   { type: String },
  instructor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:    { type: String, required: true, enum: ['development', 'design', 'data', 'business', 'marketing', 'other'] },
  level:       { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  language:    { type: String, default: 'English' },
  thumbnail:   { type: String, default: '' },
  sections:    [sectionSchema],
  price: {
    current:  { type: Number, default: 0 },
    original: { type: Number, default: 0 },
  },
  isFree:          { type: Boolean, default: false },
  status:          { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  enrollmentCount: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 },
  },
  tags:          [String],
  requirements:  [String],
  outcomes:      [String],
  totalDuration: { type: Number, default: 0 }, // in minutes
  totalLectures: { type: Number, default: 0 },
  featuredUntil: { type: Date },
  publishedAt:   { type: Date },
}, { timestamps: true });

// Auto-generate slug from title
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
