const mongoose = require('mongoose');

const IndexingLogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  engine: { type: String, enum: ['google', 'indexnow', 'bing'], required: true },
  action: { type: String, enum: ['URL_UPDATED', 'URL_DELETED'], default: 'URL_UPDATED' },
  status: { type: String, enum: ['success', 'error', 'pending'], default: 'pending' },
  statusCode: { type: Number },
  message: { type: String, default: '' },
  triggeredBy: { type: String, enum: ['auto', 'manual', 'bulk'], default: 'manual' },
}, { timestamps: true });

IndexingLogSchema.index({ createdAt: -1 });
IndexingLogSchema.index({ url: 1, engine: 1 });

module.exports = mongoose.model('IndexingLog', IndexingLogSchema);
