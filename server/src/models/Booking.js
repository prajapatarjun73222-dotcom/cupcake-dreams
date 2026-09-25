const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    enquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
    eventDate: { type: Date, required: true },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    venue: { type: String, default: '' },
    eventType: { type: String, default: '' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    guestCount: { type: Number },
    status: {
      type: String,
      enum: ['new_enquiry', 'contacted', 'pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ eventDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
