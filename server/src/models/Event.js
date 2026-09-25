const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: 'Other' },
    date: { type: Date },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    servicesUsed: [{ type: String }],
    imageUrls: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
