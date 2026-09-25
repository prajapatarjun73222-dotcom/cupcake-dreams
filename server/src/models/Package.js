const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    includedServices: [{ type: String }],
    optionalServices: [{ type: String }],
    startingPrice: { type: String, default: null },
    imageUrl: { type: String, default: '' },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
