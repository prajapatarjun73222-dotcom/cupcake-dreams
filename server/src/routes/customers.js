const express = require('express');
const Customer = require('../models/Customer');
const Enquiry = require('../models/Enquiry');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? {
          $or: [
            { name: new RegExp(q, 'i') },
            { email: new RegExp(q, 'i') },
            { phone: new RegExp(q, 'i') },
          ],
        }
      : {};
    const items = await Customer.find(filter).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Not found' });
    const [enquiries, bookings, events] = await Promise.all([
      Enquiry.find({ customer: customer._id }).sort({ receivedAt: -1 }),
      Booking.find({ customer: customer._id }).sort({ eventDate: -1 }),
      Event.find({ customer: customer._id }).sort({ date: -1 }),
    ]);
    const now = new Date();
    res.json({
      customer,
      enquiries,
      bookings,
      events,
      previousEvents: bookings.filter((b) => b.eventDate < now && b.status === 'completed'),
      upcomingEvents: bookings.filter((b) => b.eventDate >= now && b.status !== 'cancelled'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await Customer.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Customer.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
