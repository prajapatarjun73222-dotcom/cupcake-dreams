const express = require('express');
const Booking = require('../models/Booking');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const to = req.query.to
      ? new Date(req.query.to)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

    const bookings = await Booking.find({
      eventDate: { $gte: from, $lte: to },
    })
      .populate('customer')
      .populate('package')
      .sort({ eventDate: 1 });

    res.json({ view: req.query.view || 'month', from, to, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
