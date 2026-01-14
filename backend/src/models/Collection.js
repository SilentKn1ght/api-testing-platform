const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }],
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
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for performance
// Compound index for common query patterns (sorting by updatedAt)
collectionSchema.index({ updatedAt: -1, _id: 1 });
// Text index for name searching
collectionSchema.index({ name: 'text', description: 'text' });
// Simple index for exact name lookups
collectionSchema.index({ name: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
