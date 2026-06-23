const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  photo:          { type: String, default: '' },
  designation:    { type: String, default: 'Property Advisor' },
  experience:     { type: String, default: '' },       // "8+ years"
  specializations:[String],                            // ['Dwarka Expressway', 'Golf Course Road']
  credentials:    { type: String, default: '' },       // "RERA Agent ID: XXXXX, CREDAI Member"
  reraAgentId:    { type: String, default: '' },
  bio:            { type: String, default: '' },       // short (1-2 lines)
  fullBio:        { type: String, default: '' },       // longer for /about page
  education:      { type: String, default: '' },       // "MBA Finance, Delhi University"
  languages:      [String],
  dealsCount:     { type: String, default: '' },       // "200+ deals closed"
  awards:         [String],
  socialLinkedIn: { type: String, default: '' },
  socialTwitter:  { type: String, default: '' },
  email:          { type: String, default: '' },
  phone:          { type: String, default: '' },
  isActive:       { type: Boolean, default: true },
  isFeatured:     { type: Boolean, default: false },
  sortOrder:      { type: Number, default: 0 },
}, { timestamps: true });

AuthorSchema.index({ slug: 1 });
AuthorSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Author', AuthorSchema);
