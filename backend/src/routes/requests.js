const express = require('express');
const Request = require('../models/Request');
const Collection = require('../models/Collection');
const cacheMiddleware = require('../middleware/cache');
const { invalidateResourceCache } = require('../middleware/cache');
const router = express.Router();

// Get all requests (with caching for 2 minutes)
// Optional query: ?collectionId=null or ?collectionId=<id>
router.get('/', cacheMiddleware(120000), async (req, res) => {
  try {
    const { collectionId } = req.query;
    let filter = {};
    
    if (collectionId === 'null') {
      // Get standalone requests (no collectionId)
      filter = { collectionId: null };
    } else if (collectionId) {
      // Get requests for specific collection
      filter = { collectionId };
    }
    // else: no filter, get all requests

    const requests = await Request.find(filter)
      .sort({ updatedAt: -1 })
      .lean(); // Convert to plain JS objects for better performance
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create request
router.post('/', async (req, res) => {
  try {
    const { name, method, url, headers, body, params, auth, tests, collectionId } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Request name is required' });
    }
    
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const request = new Request({
      name: name.trim(),
      method: method || 'GET',
      url: url.trim(),
      headers: headers || {},
      body: body || '',
      params: params || {},
      auth: auth || { type: 'none' },
      tests: tests || '',
      collectionId
    });
    
    await request.save();

    // Add request to collection if collectionId is provided
    if (collectionId) {
      await Collection.findByIdAndUpdate(
        collectionId,
        { $push: { requests: request._id }, updatedAt: Date.now() }
      );
    }
    
    // Invalidate requests and collections caches after creating new request
    invalidateResourceCache('requests');
    invalidateResourceCache('collections');
    console.log('📋 Cache invalidated: Requests list and collections updated');
    
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get single request (with caching for 2 minutes)
router.get('/:id', cacheMiddleware(120000), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .lean(); // Convert to plain JS objects for better performance
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update request
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Invalidate requests and collections caches after update
    invalidateResourceCache('requests');
    invalidateResourceCache('collections');
    console.log(`📋 Cache invalidated: Request ${req.params.id} updated`);
    
    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete request
router.delete('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Remove request from collection if it belongs to one
    if (request.collectionId) {
      await Collection.findByIdAndUpdate(
        request.collectionId,
        { $pull: { requests: request._id }, updatedAt: Date.now() }
      );
    }
    
    await Request.findByIdAndDelete(req.params.id);
    
    // Invalidate requests and collections caches after deletion
    invalidateResourceCache('requests');
    invalidateResourceCache('collections');
    console.log(`📋 Cache invalidated: Request ${req.params.id} deleted`);
    
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get requests by collection (with caching for 2 minutes)
router.get('/collection/:collectionId', cacheMiddleware(120000), async (req, res) => {
  try {
    const requests = await Request.find({ collectionId: req.params.collectionId })
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects for better performance
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
