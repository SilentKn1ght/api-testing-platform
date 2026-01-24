const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    default: 'GET'
  },
  url: {
    type: String,
    required: true
  },
  headers: {
    type: Map,
    of: String,
    default: {}
  },
  body: {
    type: String,
    default: ''
  },
  params: {
    type: Map,
    of: String,
    default: {}
  },
  auth: {
    type: {
      type: String,
      enum: ['none', 'basic', 'bearer', 'api-key'],
      default: 'none'
    },
    username: String,
    password: String,
    token: String,
    apiKey: String
  },
  tests: {
    type: String,
    default: ''
  },
  response: {
    status: Number,
    statusText: String,
    data: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed,
    time: Number
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for performance
// Compound index for collection-based queries with sorting
requestSchema.index({ collectionId: 1, updatedAt: -1 });
// Text index for searching requests by name and URL
requestSchema.index({ name: 'text', url: 'text' });
// Simple index for method filtering
requestSchema.index({ method: 1 });
// Compound index for common sorting pattern
requestSchema.index({ updatedAt: -1, _id: 1 });

module.exports = mongoose.model('Request', requestSchema);
