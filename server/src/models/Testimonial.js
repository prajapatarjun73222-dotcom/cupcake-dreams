const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    eventType: { type: String, default: '' },
    review: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
