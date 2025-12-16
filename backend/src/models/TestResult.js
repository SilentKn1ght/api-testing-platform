const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  tests: [{
    name: String,
    passed: Boolean,
    message: String
  }],
  executionTime: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestResult', testResultSchema);
