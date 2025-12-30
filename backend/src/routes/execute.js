const express = require('express');
const axios = require('axios');
const router = express.Router();

// Validate URL format
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

// Execute API request
router.post('/', async (req, res) => {
  try {
    const { method, url, headers = {}, body, auth, params } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Prepare auth if provided
    let authHeader = {};
    if (auth?.type === 'bearer' && auth.token) {
      authHeader = { Authorization: `Bearer ${auth.token}` };
    } else if (auth?.type === 'basic' && auth.username && auth.password) {
      const encoded = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
      authHeader = { Authorization: `Basic ${encoded}` };
    } else if (auth?.type === 'api-key' && auth.apiKey) {
      authHeader = { 'X-API-Key': auth.apiKey };
    }

    const startTime = Date.now();

    // Execute the request
    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers: { ...headers, ...authHeader },
      data: body && ['post', 'put', 'patch'].includes(method.toLowerCase()) ? body : undefined,
      params: params || {},
      validateStatus: () => true, // Don't throw on any status
      maxRedirects: 5,
      timeout: 30000 // 30 second timeout
    });

    const endTime = Date.now();

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      time: endTime - startTime
    });
  } catch (error) {
    console.error('Request execution error:', error);
    // Sanitize error response - don't expose internal details
    const errorResponse = {
      error: 'Request failed'
    };
    
    // Only include safe error details
    if (error.code === 'ENOTFOUND') {
      errorResponse.error = 'Host not found. Check the URL.';
    } else if (error.code === 'ECONNREFUSED') {
      errorResponse.error = 'Connection refused. Server may be down.';
    } else if (error.code === 'ETIMEDOUT') {
      errorResponse.error = 'Request timeout. Server took too long to respond.';
    }
    
    res.status(500).json(errorResponse);
  }
});

module.exports = router;
