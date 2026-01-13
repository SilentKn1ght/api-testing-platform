const express = require('express');
const Collection = require('../models/Collection');
const Request = require('../models/Request');
const cacheMiddleware = require('../middleware/cache');
const { invalidateResourceCache } = require('../middleware/cache');
const router = express.Router();

// Get all collections (with caching for 2 minutes)
router.get('/', cacheMiddleware(120000), async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate({
        path: 'requests',
        select: '_id name method url'
      })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create collection
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const collection = new Collection({ 
      name: name.trim(), 
      description: description || '' 
    });
    
    await collection.save();
    
    // Invalidate collections cache after creating new collection
    invalidateResourceCache('collections');
    console.log('📦 Cache invalidated: Collections list updated');
    
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get single collection (with caching for 2 minutes)
router.get('/:id', cacheMiddleware(120000), async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('requests') // Populate requests for detail view
      .lean(); // Convert to plain JS objects for better performance
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update collection
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      { 
        name: name?.trim(), 
        description,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Invalidate collection caches after update
    invalidateResourceCache('collections');
    console.log(`📦 Cache invalidated: Collection ${req.params.id} updated`);
    
    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete collection
router.delete('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Delete all requests in this collection
    await Request.deleteMany({ collectionId: req.params.id });
    
    await Collection.findByIdAndDelete(req.params.id);
    
    // Invalidate related caches after deletion
    invalidateResourceCache('collections');
    invalidateResourceCache('requests');
    console.log(`📦 Cache invalidated: Collection ${req.params.id} and related requests deleted`);
    
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
