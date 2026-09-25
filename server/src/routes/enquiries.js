const express = require('express');
const Enquiry = require('../models/Enquiry');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const BusinessSettings = require('../models/BusinessSettings');
const { requireAuth } = require('../middleware/auth');
const { notifyEmailStub } = require('../utils/helpers');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      startTime,
      location,
      guestCount,
      package: packageId,
      preferredPackageName,
      servicesRequired,
      budgetRange,
      theme,
      message,
      inspirationUrls,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    let customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      customer = await Customer.create({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
      });
    } else {
      customer.name = name;
      if (phone) customer.phone = phone;
      await customer.save();
    }

    const enquiry = await Enquiry.create({
      customer: customer._id,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      eventType: eventType || '',
      eventDate: eventDate || undefined,
      startTime: startTime || '',
      location: location || '',
      guestCount: guestCount ? Number(guestCount) : undefined,
      package: packageId || undefined,
      preferredPackageName: preferredPackageName || '',
      servicesRequired: servicesRequired || [],
      budgetRange: budgetRange || '',
      theme: theme || '',
      message: message || '',
      inspirationUrls: inspirationUrls || [],
      status: 'new',
    });

    await Notification.create({
      type: 'enquiry',
      title: 'New enquiry received',
      message: `${name} enquired about ${eventType || 'an event'}${eventDate ? ` on ${new Date(eventDate).toLocaleDateString('en-GB')}` : ''}`,
      link: `/admin/enquiries/${enquiry._id}`,
      relatedId: enquiry._id,
    });

    const settings = await BusinessSettings.findOne();
    notifyEmailStub(
      settings,
      'New event enquiry',
      `New enquiry from ${name} (${email}). View in admin dashboard.`
    );

    const populated = await Enquiry.findById(enquiry._id)
      .populate('package')
      .populate('customer');

    res.status(201).json({
      message:
        'Thank you! Your enquiry has been received. Cupcake Dreams Events And Party Planner will review your event details and get back to you shortly.',
      enquiry: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const items = await Enquiry.find(filter)
      .populate('package')
      .populate('customer')
      .sort({ receivedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Enquiry.findById(req.params.id)
      .populate('package')
      .populate('customer')
      .populate('booking');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('package')
      .populate('customer');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/notes', requireAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    enquiry.internalNotes.push({ text: req.body.text });
    await enquiry.save();
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/confirm', requireAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Not found' });

    let booking = enquiry.booking ? await Booking.findById(enquiry.booking) : null;
    if (!booking) {
      booking = await Booking.create({
        customer: enquiry.customer,
        enquiry: enquiry._id,
        eventDate: enquiry.eventDate || new Date(),
        startTime: enquiry.startTime || '',
        venue: enquiry.location || '',
        eventType: enquiry.eventType || '',
        package: enquiry.package || undefined,
        guestCount: enquiry.guestCount,
        status: 'confirmed',
        title: `${enquiry.eventType || 'Event'} — ${enquiry.name}`,
        notes: enquiry.message || '',
      });
      enquiry.booking = booking._id;
    } else {
      booking.status = 'confirmed';
      await booking.save();
    }

    enquiry.status = 'confirmed';
    await enquiry.save();

    const populated = await Enquiry.findById(enquiry._id)
      .populate('package')
      .populate('customer')
      .populate('booking');

    res.json({ enquiry: populated, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
      .populate('package')
      .populate('customer');
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    if (enquiry.booking) {
      await Booking.findByIdAndUpdate(enquiry.booking, { status: 'cancelled' });
    }
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
