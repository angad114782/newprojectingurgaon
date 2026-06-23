const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  description: { type: String },
  page: { type: String },
  projectSlug: { type: String },
  scoreAdded: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema(
  {
    // Identity
    visitorId: { type: String, required: true, index: true }, // anonymous tracking ID
    name: { type: String, trim: true },
    mobile: { type: String, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },

    // OTP verification
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    // Interest
    budget: { type: String },
    preferredLocation: { type: String },
    buyingPurpose: {
      type: String,
      enum: ['Investment', 'Self Use', 'Both', ''],
      default: '',
    },
    timeline: {
      type: String,
      enum: ['Immediately', '3 Months', '6 Months', 'Not Decided', ''],
      default: '',
    },
    interestedProject: { type: String },
    interestedLocation: { type: String },

    // Consent
    whatsappConsent: { type: Boolean, default: false },
    consentTimestamp: { type: Date },

    // Source tracking
    sourcePage: { type: String },
    sourceURL: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    utmKeyword: { type: String },
    referrer: { type: String },

    // Lead scoring
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Cold', 'Warm', 'Hot', 'Priority', 'Booked', 'Lost'],
      default: 'Cold',
    },

    // Assignment
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followUpDate: { type: Date },
    remarks: { type: String },
    lostReason: { type: String },

    // WhatsApp
    whatsappSent: { type: Boolean, default: false },
    whatsappSentAt: { type: Date },
    whatsappMessages: [
      {
        type: { type: String },
        message: { type: String },
        sentAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' },
      },
    ],

    // Email
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },

    // Behavior
    pagesViewed: [{ type: String }],
    projectsViewed: [{ type: String }],
    locationsViewed: [{ type: String }],
    ctasClicked: [{ type: String }],
    timeOnSite: { type: Number, default: 0 }, // seconds
    sessionCount: { type: Number, default: 1 },
    lastSeen: { type: Date, default: Date.now },

    // Timeline
    timeline_events: [TimelineEventSchema],

    // Device
    deviceType: { type: String },
    browser: { type: String },
    ipAddress: { type: String },

    // Site visit
    siteVisitRequested: { type: Boolean, default: false },
    siteVisitDate: { type: Date },
    siteVisitStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', ''],
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-update status based on score
LeadSchema.pre('save', function (next) {
  if (this.score <= 10) this.status = 'Cold';
  else if (this.score <= 30) this.status = 'Warm';
  else if (this.score <= 60) this.status = 'Hot';
  else this.status = 'Priority';

  // Override for manually set terminal statuses
  if (['Booked', 'Lost'].includes(this._previousStatus)) {
    this.status = this._previousStatus;
  }
  next();
});

// Add score event helper
LeadSchema.methods.addEvent = function (event, description, page, scoreAdded, projectSlug) {
  this.score += scoreAdded || 0;
  this.timeline_events.push({ event, description, page, scoreAdded, projectSlug });
  this.lastSeen = new Date();
};

const Lead = mongoose.model('Lead', LeadSchema);
module.exports = Lead;
