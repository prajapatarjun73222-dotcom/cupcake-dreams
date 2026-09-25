const express = require('express');
const EventCategory = require('../models/EventCategory');
const { requireAuth } = require('../middleware/auth');
const { slugify } = require('../utils/helpers');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { active: true };
    const items = await EventCategory.find(filter).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) data.slug = slugify(data.name);
    const item = await EventCategory.create(data);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.name && !data.slug) data.slug = slugify(data.name);
    const item = await EventCategory.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const item = await EventCategory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
