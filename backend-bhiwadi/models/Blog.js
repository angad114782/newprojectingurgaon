const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  heading: String,
  content: String,
  link: String,
  linkText: String,
}, { _id: false });

const FaqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true },
}, { _id: false });

const RelatedLinkSchema = new mongoose.Schema({
  label: String,
  href: String,
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt:     { type: String, trim: true },
  heroImage:   { type: String, default: '' },
  category:    { type: String, default: 'Guide' },
  status:      { type: String, enum: ['draft', 'published'], default: 'published' },

  author: {
    name:        { type: String, default: 'New Projects in Bhiwadi' },
    bio:         { type: String, default: '' },
    credentials: { type: String, default: '' },
    avatar:      { type: String, default: '' },
  },

  date:        { type: Date, default: Date.now },
  dateModified:{ type: Date, default: Date.now },
  readTime:    { type: String, default: '5 min' },
  keywords:    [{ type: String }],
  intro:       { type: String, default: '' },
  sections:    [SectionSchema],
  faqs:        [FaqSchema],
  relatedLinks:[RelatedLinkSchema],
}, { timestamps: true });

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1, date: -1 });

module.exports = mongoose.model('Blog', BlogSchema);
