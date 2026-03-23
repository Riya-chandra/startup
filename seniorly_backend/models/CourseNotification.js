const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email:            { type: String, required: true, lowercase: true, trim: true },
  course:           { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseTitle:      { type: String }, // for upcoming courses not yet in DB
  notificationType: { type: String, enum: ['launch', 'discount', 'reminder', 'update'], default: 'launch' },
  status:           { type: String, enum: ['pending', 'notified', 'cancelled'], default: 'pending' },
  notifiedAt:       { type: Date },
  preferences: {
    emailNotification: { type: Boolean, default: true },
    notifyOnLaunch:    { type: Boolean, default: true },
    notifyOnDiscount:  { type: Boolean, default: false },
  },
}, { timestamps: true });

notificationSchema.index({ email: 1, course: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('CourseNotification', notificationSchema);
