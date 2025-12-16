const express = require('express');
const Collection = require('../models/Collection');
const Request = require('../models/Request');
const router = express.Router();

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate('requests')
      .sort({ updatedAt: -1 });
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
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get single collection
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('requests');
    
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
    
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
