const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
require('dotenv').config();

// API Testing Platform Backend Server

const app = express();

// Import query logger
const { 
  initializeQueryLogger, 
  queryStatsMiddleware, 
  startPeriodicStatsLogging 
} = require('./middleware/queryLogger');

// Initialize query performance logging
initializeQueryLogger();

// Middleware
app.use(cors());
app.use(compression()); // Enable gzip compression
app.use(express.json({ limit: '50mb' }));
app.use(queryStatsMiddleware); // Add query stats logging

// Connect MongoDB with optimized settings
let mongoConnected = false;
mongoose.connect(process.env.MONGODB_URI, {
  // Connection pool size for better concurrent query handling
  maxPoolSize: 10,
  minPoolSize: 2,
  // Socket timeout
  socketTimeoutMS: 45000,
  // Server selection timeout
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    mongoConnected = true;
    console.log('✅ MongoDB connected with optimized pool settings');
    // Start periodic database stats logging
    startPeriodicStatsLogging(30); // Log stats every 30 minutes
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

// Database statistics endpoint (development only)
app.get('/api/db-stats', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Endpoint not available in production' });
  }
  
  try {
    const { getDatabaseStats } = require('./middleware/queryLogger');
    const stats = await getDatabaseStats();
    res.json(stats || { error: 'Unable to fetch stats' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
console.log(`📋 Attempting to bind to ${HOST}:${PORT} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);

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
