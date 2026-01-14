/**
 * MongoDB Query Performance Logger
 * Logs slow queries and provides query performance metrics
 */

const mongoose = require('mongoose');

// Configuration
const SLOW_QUERY_THRESHOLD = 100; // milliseconds
const ENABLE_QUERY_LOGGING = process.env.NODE_ENV === 'development';

/**
 * Initialize query logging for MongoDB
 */
const initializeQueryLogger = () => {
  if (!ENABLE_QUERY_LOGGING) {
    console.log('📊 Query logging disabled in production mode');
    return;
  }

  // Enable Mongoose debug mode for query logging
  mongoose.set('debug', (collectionName, method, query, doc, options) => {
    const queryInfo = {
      collection: collectionName,
      method,
      query: JSON.stringify(query),
      timestamp: new Date().toISOString()
    };

    console.log(`🔍 MongoDB Query: ${method} on ${collectionName}`, queryInfo);
  });

  // Monitor query performance
  mongoose.plugin((schema) => {
    // Pre-execution hook to capture start time
    schema.pre(/^find/, function() {
      this._startTime = Date.now();
    });

    schema.pre('save', function() {
      this._startTime = Date.now();
    });

    schema.pre('updateOne', function() {
      this._startTime = Date.now();
    });

    schema.pre('deleteOne', function() {
      this._startTime = Date.now();
    });

    schema.pre('deleteMany', function() {
      this._startTime = Date.now();
    });

    // Post-execution hook to log performance
    schema.post(/^find/, function(docs) {
      const duration = Date.now() - this._startTime;
      if (duration > SLOW_QUERY_THRESHOLD) {
        console.warn(`⚠️  SLOW QUERY detected (${duration}ms):`, {
          operation: 'find',
          model: this.model.modelName,
          filter: this.getQuery(),
          duration: `${duration}ms`
        });
      }
    });

    schema.post('save', function() {
      const duration = Date.now() - this._startTime;
      if (duration > SLOW_QUERY_THRESHOLD) {
        console.warn(`⚠️  SLOW QUERY detected (${duration}ms):`, {
          operation: 'save',
          model: this.constructor.modelName,
          duration: `${duration}ms`
        });
      }
    });
  });

  console.log('📊 Query performance logging enabled (threshold: ' + SLOW_QUERY_THRESHOLD + 'ms)');
};

/**
 * Express middleware to log request-level database statistics
 */
const queryStatsMiddleware = (req, res, next) => {
  if (!ENABLE_QUERY_LOGGING) {
    return next();
  }

  const startTime = Date.now();
  const originalJson = res.json.bind(res);

  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    // Log request completion with timing
    console.log(`✅ Request completed: ${req.method} ${req.path} (${duration}ms)`);
    
    return originalJson(data);
  };

  next();
};

/**
 * Get current database statistics
 */
const getDatabaseStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
      indexes: stats.indexes,
      indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
      avgObjSize: `${(stats.avgObjSize / 1024).toFixed(2)} KB`,
      documents: stats.objects
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return null;
  }
};

/**
 * Log database statistics periodically
 */
const startPeriodicStatsLogging = (intervalMinutes = 30) => {
  if (!ENABLE_QUERY_LOGGING) {
    return;
  }

  setInterval(async () => {
    const stats = await getDatabaseStats();
    if (stats) {
      console.log('📊 Database Statistics:', stats);
    }
  }, intervalMinutes * 60 * 1000);
};

module.exports = {
  initializeQueryLogger,
  queryStatsMiddleware,
  getDatabaseStats,
  startPeriodicStatsLogging
};
