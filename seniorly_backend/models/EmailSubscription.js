const mongoose = require('mongoose');

const emailSubSchema = new mongoose.Schema({
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  firstName:        { type: String, trim: true },
  subscriptionType: { type: String, enum: ['newsletter', 'course_notifications', 'all'], default: 'newsletter' },
  status:           { type: String, enum: ['pending', 'active', 'unsubscribed'], default: 'pending' },
  interests:        [{ type: String }],
  isConfirmed:      { type: Boolean, default: false },
  confirmToken:     { type: String },
  unsubscribeToken: { type: String },
  source:           { type: String, default: 'website' },
  engagementData: {
    totalEmailsSent:   { type: Number, default: 0 },
    totalEmailsOpened: { type: Number, default: 0 },
    totalClicks:       { type: Number, default: 0 },
    openRate:          { type: Number, default: 0 },
    lastOpenedAt:      { type: Date },
  },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('EmailSubscription', emailSubSchema);
