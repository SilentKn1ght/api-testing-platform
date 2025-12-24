/**
 * Simple in-memory cache middleware for API responses
 * Caches GET requests for configurable duration
 */

const cache = new Map();

const cacheMiddleware = (duration = 300000) => { // Default 5 minutes
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse && Date.now() < cachedResponse.expiry) {
      // Return cached response
      return res.json(cachedResponse.data);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data) {
      cache.set(key, {
        data,
        expiry: Date.now() + duration
      });
      return originalJson(data);
    };

    next();
  };
};

// Clear cache periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expiry) {
      cache.delete(key);
    }
  }
}, 60000); // Clean up every minute

module.exports = cacheMiddleware;
