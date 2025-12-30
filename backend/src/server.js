const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
require('dotenv').config();

// API Testing Platform Backend Server

const app = express();

// Middleware
app.use(cors());
app.use(compression()); // Enable gzip compression
app.use(express.json({ limit: '50mb' }));

// Connect MongoDB
let mongoConnected = false;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    mongoConnected = true;
    console.log('✅ MongoDB connected');
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    console.error('Server starting without database connection - requests will fail');
  });

// Health check includes DB status
app.get('/health', (req, res) => {
  res.status(mongoConnected ? 200 : 503).json({ 
    status: 'API Testing Backend is running',
    database: mongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/collections', require('./routes/collections'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/execute', require('./routes/execute'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
