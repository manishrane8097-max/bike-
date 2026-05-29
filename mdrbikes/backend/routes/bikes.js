const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/bikes — public: list all available bikes
router.get('/', async (req, res) => {
  try {
    const filter = { available: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;

    const bikes = await Bike.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: bikes.length, bikes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch bikes.' });
  }
});

// GET /api/bikes/all — admin: all bikes including unavailable
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const bikes = await Bike.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bikes.length, bikes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch bikes.' });
  }
});

// GET /api/bikes/:id
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found.' });
    res.json({ success: true, bike });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch bike.' });
  }
});

// POST /api/bikes — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const bike = await Bike.create(req.body);
    res.status(201).json({ success: true, message: 'Bike added!', bike });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/bikes/:id — admin only
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found.' });
    res.json({ success: true, message: 'Bike updated!', bike });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/bikes/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found.' });
    res.json({ success: true, message: 'Bike deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete bike.' });
  }
});

module.exports = router;
