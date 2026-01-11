/**
 * In-memory cache middleware with smart invalidation strategy
 * Caches GET requests for configurable duration
 * Automatically invalidates related cache entries on data mutations
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

/**
 * Invalidate specific cache entries by key or pattern
 * @param {string|RegExp} pattern - Exact key string or RegExp pattern to match
 */
const invalidateCache = (pattern) => {
  if (typeof pattern === 'string') {
    // Exact key match
    cache.delete(pattern);
  } else if (pattern instanceof RegExp) {
    // Pattern match - delete all keys matching the regex
    for (const key of cache.keys()) {
      if (pattern.test(key)) {
        cache.delete(key);
      }
    }
  }
};

/**
 * Invalidate all cache entries for a resource type
 * @param {string} resourceType - 'collections' or 'requests'
 * @param {string} id - Optional specific resource ID to narrow invalidation
 */
const invalidateResourceCache = (resourceType, id = null) => {
  if (resourceType === 'collections') {
    // Invalidate all collection-related caches
    invalidateCache(/\/api\/collections/);
  } else if (resourceType === 'requests') {
    if (id) {
      // Invalidate specific request and its collection's requests list
      invalidateCache(/\/api\/requests/);
      invalidateCache(/\/api\/collections/);
    } else {
      // Invalidate all request-related caches
      invalidateCache(/\/api\/requests/);
      invalidateCache(/\/api\/collections/);
    }
  }
};

// Clear expired cache entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [key, value] of cache.entries()) {
    if (now > value.expiry) {
      cache.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`🧹 Cache cleanup: removed ${cleanedCount} expired entries`);
  }
}, 60000); // Clean up every minute

module.exports = cacheMiddleware;
module.exports.invalidateCache = invalidateCache;
module.exports.invalidateResourceCache = invalidateResourceCache;
module.exports.cache = cache; // Expose cache for debugging if needed
