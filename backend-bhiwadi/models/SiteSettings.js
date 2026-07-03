const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  siteKey: { type: String, default: 'bhiwadi', index: true },  // 'bhiwadi' | etc.
  siteName: { type: String, default: 'New Projects in Bhiwadi' },
  tagline: { type: String, default: "Bhiwadi's #1 Real Estate Advisory" },
  phone: { type: String, default: '+91-8619930583' },
  phone2: { type: String, default: '+91-7378006609' },
  whatsapp: { type: String, default: '918619930583' },
  email: { type: String, default: 'info@propertyinbhiwadi.com' },
  address: { type: String, default: 'Bhiwadi, Alwar, Rajasthan 301019' },
  streetAddress: { type: String, default: 'RIICO Industrial Area' },
  postalCode: { type: String, default: '301019' },
  openingHours: { type: String, default: 'Mon–Sun: 9 AM – 8 PM' },
  geoLat: { type: String, default: '28.2055' },
  geoLng: { type: String, default: '76.8480' },

  logoUrl: { type: String, default: '' },
  footerLogoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },

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

  googleBusinessProfile: { type: String, default: '' }, // Google Maps/Business profile URL

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
    businessAccountId: { type: String, default: '' },
    verifyToken: { type: String, default: '' },
    templateLanguage: { type: String, default: 'en' },
    // Template names (must match Meta-approved template names exactly)
    templateName: { type: String, default: 'lead_notification' },         // admin new lead alert
    otpTemplateName: { type: String, default: 'otp_verification' },       // OTP to user
    thankYouTemplateName: { type: String, default: 'thank_you_enquiry' }, // thank you to user after OTP
    brochureTemplateName: { type: String, default: 'brochure_send' },     // brochure request
    siteVisitTemplateName: { type: String, default: 'site_visit_confirm' }, // site visit booking confirm
    priceListTemplateName: { type: String, default: 'price_list_send' },  // price list request
    reengageTemplateName: { type: String, default: 'reengage_lead' },     // re-engagement
  },

  // RERA Info (shown in footer)
  reraNumber: { type: String, default: '' },
  reraLink: { type: String, default: 'https://rera.rajasthan.gov.in' },

  // Conversion / Psych Triggers — fully admin-configurable
  conversion: {
    urgencyBanner: {
      enabled: { type: Boolean, default: true },
      message: { type: String, default: 'Price hike alert: Bhiwadi NH-48 projects raising prices by 5–8% in Q3 2026.' },
      linkText: { type: String, default: 'Lock today\'s price →' },
      linkHref: { type: String, default: '#lead-form' },
    },
    liveActivity: {
      enabled: { type: Boolean, default: true },
      firstDelay: { type: Number, default: 8000 },
      interval: { type: Number, default: 22000 },
      duration: { type: Number, default: 4500 },
      cities: { type: [String], default: ['Delhi', 'Noida', 'Faridabad', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chandigarh'] },
      names: { type: [String], default: ['Rahul S.', 'Priya K.', 'Amit V.', 'Neha G.', 'Vikram M.', 'Sunita R.', 'Rohit B.', 'Anjali T.'] },
      actions: { type: [String], default: ['just requested the price list', 'booked a free site visit', 'downloaded the brochure', 'asked about payment plans', 'enquired about floor plans', 'checked unit availability'] },
    },
    viewingCount: {
      enabled: { type: Boolean, default: true },
      minCount: { type: Number, default: 18 },
      maxCount: { type: Number, default: 55 },
    },
    scarcityBadge: {
      enabled: { type: Boolean, default: true },
      units: { type: Number, default: 4 },
    },
    priceCountdown: { enabled: { type: Boolean, default: true } },
    exitPopup: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Wait! Don't Miss This" },
      offerText: { type: String, default: 'Get ₹2 Lakh off on pre-launch booking price — exclusive for today\'s visitors' },
      ctaText: { type: String, default: 'Get ₹2 Lakh Off — Send on WhatsApp 💬' },
    },
    scrollModal: {
      enabled: { type: Boolean, default: true },
      triggerPercent: { type: Number, default: 60 },
    },
    trustStrip: {
      enabled: { type: Boolean, default: true },
      signals: { type: [{ icon: String, text: String }], default: [
        { icon: '🏆', text: '4,200+ Families Helped' },
        { icon: '✅', text: 'RERA Verified Projects Only' },
        { icon: '🎓', text: 'Certified Property Advisors' },
        { icon: '💯', text: 'Zero Brokerage for Buyers' },
        { icon: '⚡', text: '2-Hour Response Guarantee' },
        { icon: '🔒', text: 'Your Data is Private' },
      ]},
    },
    roiCalculator: { enabled: { type: Boolean, default: true } },
    priceGate: { enabled: { type: Boolean, default: true } },
  },

  // Third-party portal API keys
  integrations: {
    '99acres':    { type: String, default: '' },
    magicbricks:  { type: String, default: '' },
  },

  // AI / LLM — stored in DB so admin can update without touching .env
  anthropicApiKey: { type: String, default: '' },

  // Instant Indexing — IndexNow key for Bing/Yandex/DuckDuckGo
  indexNowKey: { type: String, default: '' },
  indexingAutoSubmit: { type: Boolean, default: true },

  // Google Search Console integration
  googleSearchConsole: {
    verificationCode: { type: String, default: '' }, // meta tag content= value for domain verification
    siteUrl: { type: String, default: '' },
    serviceAccountJson: { type: String, default: '' }, // JSON as string (sensitive)
    connected: { type: Boolean, default: false },
  },

  // Hero section — fully admin-configurable
  // Ads & Tracking — Meta Pixel, Google Ads, GTM (fully admin-managed)
  metaPixelId:               { type: String, default: '' },   // Facebook/Instagram Pixel ID
  googleAdsId:               { type: String, default: '' },   // AW-XXXXXXXXXX
  googleAdsConversionLabel:  { type: String, default: '' },   // conversion action label
  googleAdsConversionValue:  { type: Number, default: 0 },    // optional INR value per lead
  gtmId:                     { type: String, default: '' },   // GTM-XXXXXXX

  // Corridors — dynamically managed from admin, grouped by city
  corridors: {
    type: [{
      name:  { type: String, required: true },
      slug:  { type: String, required: true },
      href:  { type: String, required: true },
      icon:  { type: String, default: '🛣️' },
      city:  { type: String, default: 'Bhiwadi' },
    }],
    default: [
      { name: 'NH-48 Corridor',          slug: 'nh-48',                   href: '/nh-48-bhiwadi-projects',         icon: '🛣️', city: 'Bhiwadi' },
      { name: 'Bhiwadi Extension',       slug: 'bhiwadi-extension',        href: '/bhiwadi-extension-projects',     icon: '🏗️', city: 'Bhiwadi' },
      { name: 'Khushkhera',              slug: 'khushkhera',               href: '/khushkhera-bhiwadi-projects',    icon: '🌿', city: 'Bhiwadi' },
      { name: 'Tapukara',               slug: 'tapukara',                 href: '/tapukara-bhiwadi-projects',      icon: '🌳', city: 'Bhiwadi' },
      { name: 'Chopanki',               slug: 'chopanki',                 href: '/chopanki-bhiwadi-projects',      icon: '🏭', city: 'Bhiwadi' },
      { name: 'Bhiwadi Phase 3',        slug: 'bhiwadi-phase-3',          href: '/new-projects-in-bhiwadi',        icon: '🏢', city: 'Bhiwadi' },
      { name: 'RIICO Industrial Area',  slug: 'riico',                    href: '/industrial-plots-bhiwadi',       icon: '🏗️', city: 'Bhiwadi' },
    ],
  },

  heroTagline: { type: String, default: "Bhiwadi's #1 Real Estate Advisory" },
  heroTitle: { type: String, default: 'New Projects in Bhiwadi 2025' },
  heroTitleAccent: { type: String, default: '' },
  heroSubtitle: { type: String, default: '150+ verified new launch, pre-launch and ready-to-move properties. Free site visit. Transparent pricing. RERA approved.' },
  heroCTAPrimary: { type: String, default: '🏠 Book Free Site Visit' },
  heroCTASecondary: { type: String, default: 'View New Launches →' },
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=85' },

  // E-E-A-T — Company info for About page (admin-managed)
  companyInfo: {
    foundingYear:     { type: String, default: '2019' },
    teamSize:         { type: String, default: '15+' },
    aboutTitle:       { type: String, default: '' },
    aboutContent:     { type: String, default: '' },
    missionStatement: { type: String, default: '' },
    mapEmbedUrl:      { type: String, default: '' },   // Google Maps iframe src
    officeImage:      { type: String, default: '' },
    awards: [{
      title:  String,
      year:   String,
      issuer: String,
    }],
    certifications: [{
      name:   String,
      issuer: String,
      id:     String,
      link:   String,
    }],
    mediaLinks: [{
      outlet: String,
      title:  String,
      href:   String,
      date:   String,
    }],
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
