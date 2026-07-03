const mongoose = require('mongoose');

const FloorPlanSchema = new mongoose.Schema({
  config: String,
  area: String,
  price: String,
}, { _id: false });

const FAQSchema = new mongoose.Schema({
  q: String,
  a: String,
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

  builder: {
    name: { type: String, required: true },
    logo: String,
    website: String,
    reraId: String,
  },

  location: { type: String, required: true },
  sector: String,
  corridor: String, // Dwarka Expressway, Golf Course Ext Road, SPR Road, etc.
  city: { type: String, default: 'Bhiwadi' },
  state: { type: String, default: 'Rajasthan' },
  pincode: String,
  googleMapsUrl: String,

  status: {
    type: String,
    enum: ['New Launch', 'Pre Launch', 'Under Construction', 'Ready To Move'],
    default: 'New Launch',
  },

  // Pricing
  priceDisplay: String,           // "₹1 Cr – ₹3 Cr" (display string)
  pricePerSqft: String,           // "₹8,500 – ₹9,800"
  priceMin: Number,               // in Lakhs for filtering
  priceMax: Number,
  priceOnRequest: { type: Boolean, default: false },

  configurations: [String],       // ["2 BHK (1,200 sqft)", "3 BHK (1,680 sqft)"]
  floorPlans: [FloorPlanSchema],  // [{config, area, price}]

  // Project Info
  possession: String,
  totalUnits: Number,
  totalTowers: Number,
  totalArea: String,              // "15 Acres"
  floors: String,                 // "G+38"

  // RERA
  rera: {
    number: String,
    link: String,
    expiryDate: String,
  },

  // Descriptions
  shortDescription: String,
  description: String,

  // Lists
  highlights: [String],
  amenities: [String],
  connectivity: [String],
  nearbyLandmarks: [String],
  whyBuy: [String],
  tags: [String],

  // Images
  heroImage: String,              // URL (Unsplash or uploaded)
  gallery: [String],              // Array of URLs
  amenityImages: [String],        // Amenity photos
  floorPlanImages: [String],      // Floor plan images

  // Investment
  appreciationRate: String,       // "30–40% (3Y)"
  rentalYield: String,            // "3.5%"

  // FAQs
  faqs: [FAQSchema],

  // Flags
  isVerified: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isCommercial: { type: Boolean, default: false },

  // SEO
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,

  // Tracking
  views: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  enquiries: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ status: 1, isActive: 1 });
ProjectSchema.index({ corridor: 1, isActive: 1 });
ProjectSchema.index({ priceMin: 1, priceMax: 1 });
ProjectSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
