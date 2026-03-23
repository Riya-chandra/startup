const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // one of these will be set
  webinar:  { type: mongoose.Schema.Types.ObjectId, ref: 'Webinar' },
  session:  { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },

  status:  { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  progress: {
    completedLectures:   { type: [String], default: [] },
    percentageCompleted: { type: Number, default: 0 },
    totalTimeSpent:      { type: Number, default: 0 },
    lastAccessedAt:      { type: Date },
  },
  paymentMethod: { type: String, enum: ['free', 'card', 'upi', 'netbanking'], default: 'free' },
  amountPaid:    { type: Number, default: 0 },
  transactionId: { type: String },
  certificate: {
    issued:        { type: Boolean, default: false },
    certificateId: { type: String },
    issuedAt:      { type: Date },
    downloadUrl:   { type: String },
  },
  completedAt: { type: Date },
  source:      { type: String, default: 'website' },
}, { timestamps: true });

// Unique per student per webinar OR session
enrollmentSchema.index({ student: 1, webinar: 1 }, { unique: true, sparse: true });
enrollmentSchema.index({ student: 1, session: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
