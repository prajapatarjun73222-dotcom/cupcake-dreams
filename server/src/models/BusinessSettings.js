const mongoose = require('mongoose');

const businessSettingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'Cupcake Dreams Events And Party Planner' },
    logoUrl: { type: String, default: '' },
    phone: { type: String, default: '+44 7584 248854' },
    email: { type: String, default: 'hello@cupcakedreamsevents.example' },
    whatsapp: { type: String, default: '+447584248854' },
    address: {
      line1: { type: String, default: '13 Rossbank Rd' },
      city: { type: String, default: 'Port Glasgow' },
      postcode: { type: String, default: 'PA14 5AD' },
      country: { type: String, default: 'United Kingdom' },
    },
    aboutText: { type: String, default: '' },
    openingInfo: { type: String, default: 'Enquiries welcome — please get in touch to discuss your event.' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      pinterest: { type: String, default: '' },
    },
    seo: {
      title: {
        type: String,
        default: 'Cupcake Dreams Events And Party Planner | Event Styling Port Glasgow',
      },
      description: {
        type: String,
        default:
          'Professional event dressing, party planning and decorations in Port Glasgow, Scotland. Beautifully styled celebrations with thoughtful attention to detail.',
      },
      ogImageUrl: { type: String, default: '/images/hero.png' },
    },
    bookingSettings: {
      autoConfirm: { type: Boolean, default: false },
      defaultMessage: {
        type: String,
        default: 'Hi Cupcake Dreams Events And Party Planner, I\'d like to enquire about an event.',
      },
    },
    notificationEmailEnabled: { type: Boolean, default: false },
    notificationEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);
