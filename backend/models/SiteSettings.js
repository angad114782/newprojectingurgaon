const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'GurgaonRealty' },
  phone: { type: String, default: '+91-9999999999' },
  whatsapp: { type: String, default: '919999999999' },
  email: { type: String, default: 'info@gurgaonrealty.in' },
  address: { type: String, default: 'DLF Cyber City, Gurgaon, Haryana 122002' },
  streetAddress: { type: String, default: 'DLF Cyber City' },
  postalCode: { type: String, default: '122002' },
  openingHours: { type: String, default: 'Mon–Sun: 9 AM – 8 PM' },
  geoLat: { type: String, default: '28.4595' },
  geoLng: { type: String, default: '77.0266' },

  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  seoKeywords: [String],
  ogImage: { type: String, default: '/og-home.jpg' },
  ga4Id: { type: String, default: '' },

  marketStats: {
    totalProjects: { type: String, default: '150+' },
    familiesHelped: { type: String, default: '4,200+' },
    topBuilders: { type: String, default: '50+' },
    avgAppreciation: { type: String, default: '32%' },
    avgRentalYield: { type: String, default: '3.5%' },
    yearsActive: { type: String, default: '5+' },
    reviewCount: { type: String, default: '847' },
    rating: { type: String, default: '4.9' },
  },

  testimonials: [{
    name: { type: String, required: true },
    city: String,
    role: String,
    review: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatar: String,
    project: String,
  }],

  locations: [{
    name: { type: String, required: true },
    projects: { type: String, default: '10+' },
    icon: { type: String, default: '🏙️' },
    href: { type: String, required: true },
    highlight: { type: String, default: 'Popular' },
    img: String,
    color: { type: String, default: 'from-blue-900/80' },
  }],

  builders: [{
    name: { type: String, required: true },
    img: String,
    website: String,
  }],

  social: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },

  faqs: [{
    q: { type: String, required: true },
    a: { type: String, required: true },
  }],

  heroImages: [String],

  // Email / SMTP notification settings (Hostinger or any SMTP)
  smtp: {
    host: { type: String, default: 'smtp.hostinger.com' },
    port: { type: Number, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    from: { type: String, default: '' },
  },
  notificationEmail: { type: String, default: '' },

  // WhatsApp Cloud API (Meta Business)
  whatsappCloud: {
    phoneNumberId: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    adminNumber: { type: String, default: '' },
    templateName: { type: String, default: 'lead_notification' },
    otpTemplateName: { type: String, default: 'otp_verification' },
    templateLanguage: { type: String, default: 'en' },
  },

  // Hero section — fully admin-configurable
  heroTagline: { type: String, default: "Gurgaon's #1 Real Estate Advisory" },
  heroTitle: { type: String, default: 'New Projects in Gurgaon 2025' },
  heroTitleAccent: { type: String, default: '' },
  heroSubtitle: { type: String, default: '150+ verified new launch, pre-launch and ready-to-move properties. Free site visit. Transparent pricing. RERA approved.' },
  heroCTAPrimary: { type: String, default: '🏠 Book Free Site Visit' },
  heroCTASecondary: { type: String, default: 'View New Launches →' },
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=85' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
