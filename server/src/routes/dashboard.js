const express = require('express');
const Enquiry = require('../models/Enquiry');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      newEnquiries,
      pendingEnquiries,
      upcomingEvents,
      confirmedEvents,
      eventsThisMonth,
      recentEnquiries,
      unreadNotifications,
    ] = await Promise.all([
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: { $in: ['pending', 'contacted'] } }),
      Booking.countDocuments({
        eventDate: { $gte: now },
        status: { $in: ['pending', 'confirmed', 'contacted', 'new_enquiry'] },
      }),
      Booking.countDocuments({ status: 'confirmed', eventDate: { $gte: now } }),
      Booking.countDocuments({
        eventDate: { $gte: startOfMonth, $lte: endOfMonth },
        status: { $ne: 'cancelled' },
      }),
      Enquiry.find()
        .populate('package')
        .sort({ receivedAt: -1 })
        .limit(8),
      Notification.countDocuments({ read: false }),
    ]);

    res.json({
      newEnquiries,
      pendingEnquiries,
      upcomingEvents,
      confirmedEvents,
      eventsThisMonth,
      recentEnquiries,
      unreadNotifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/notifications', async (req, res) => {
  try {
    const items = await Notification.find().sort({ createdAt: -1 }).limit(30);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const item = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
