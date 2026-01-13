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
    console.error('❌ MongoDB error:', err.message);
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
try {
  const collectionsRouter = require('./routes/collections');
  app.use('/api/collections', collectionsRouter);
  console.log('✅ Collections route loaded');
} catch (err) {
  console.error('❌ Failed to load collections route:', err.message);
  console.error(err.stack);
}

try {
  const requestsRouter = require('./routes/requests');
  app.use('/api/requests', requestsRouter);
  console.log('✅ Requests route loaded');
} catch (err) {
  console.error('❌ Failed to load requests route:', err.message);
  console.error(err.stack);
}

try {
  const executeRouter = require('./routes/execute');
  app.use('/api/execute', executeRouter);
  console.log('✅ Execute route loaded');
} catch (err) {
  console.error('❌ Failed to load execute route:', err.message);
  console.error(err.stack);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1';
console.log(`📋 Attempting to bind to ${HOST}:${PORT}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

server.on('listening', () => {
  console.log('📊 Server is now listening for connections');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
