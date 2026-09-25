const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const enquirySchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    eventType: { type: String, default: '' },
    eventDate: { type: Date },
    startTime: { type: String, default: '' },
    location: { type: String, default: '' },
    guestCount: { type: Number },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    preferredPackageName: { type: String, default: '' },
    servicesRequired: [{ type: String }],
    budgetRange: { type: String, default: '' },
    theme: { type: String, default: '' },
    message: { type: String, default: '' },
    inspirationUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['new', 'contacted', 'pending', 'confirmed', 'cancelled'],
      default: 'new',
    },
    internalNotes: [noteSchema],
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
