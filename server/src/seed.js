require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminUser = require('./models/AdminUser');
const Service = require('./models/Service');
const Package = require('./models/Package');
const Event = require('./models/Event');
const GalleryImage = require('./models/GalleryImage');
const Testimonial = require('./models/Testimonial');
const EventCategory = require('./models/EventCategory');
const BusinessSettings = require('./models/BusinessSettings');

const HERO = '/images/hero.png';

/** Demo photography URLs — replace in admin with the business owner's real event photos */
const IMG = {
  roseGoldBalloons:
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80',
  birthdayParty:
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80',
  weddingTable:
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',
  balloonArch:
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=80',
  fairyLights:
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
  floralTable:
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1600&q=80',
  champagneSetup:
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80',
  blushDecor:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  candlelit:
    'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=80',
  celebrationHall:
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80',
  pastelBalloons:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
  elegantReception:
    'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1600&q=80',
};

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cupcake-dreams';
  await mongoose.connect(uri);
  console.log('Connected. Seeding...');

  await Promise.all([
    AdminUser.deleteMany({}),
    Service.deleteMany({}),
    Package.deleteMany({}),
    Event.deleteMany({}),
    GalleryImage.deleteMany({}),
    Testimonial.deleteMany({}),
    EventCategory.deleteMany({}),
    BusinessSettings.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
  await AdminUser.create({
    name: 'Admin',
    email: 'admin@cupcakedreams.local',
    passwordHash,
  });

  await BusinessSettings.create({
    businessName: 'Cupcake Dreams Events And Party Planner',
    phone: '+44 7584 248854',
    email: 'hello@cupcakedreamsevents.example',
    whatsapp: '+447584248854',
    address: {
      line1: '13 Rossbank Rd',
      city: 'Port Glasgow',
      postcode: 'PA14 5AD',
      country: 'United Kingdom',
    },
    aboutText:
      "Whether you're a seasoned event planner or putting together an event for the first time, the right event dressing can make all the difference.\n\nAt Cupcake Dreams Events And Party Planner, we help bring your celebration together through thoughtful decoration, styling and attention to detail.\n\nFrom the first idea to the finished room, we're here to help you create an event that feels special, beautiful and personal.",
    openingInfo: 'Enquiries welcome — please get in touch to discuss your event.',
    seo: {
      title: 'Cupcake Dreams Events And Party Planner | Event Styling Port Glasgow',
      description:
        'Professional event dressing, party planning and decorations in Port Glasgow, Scotland. Beautifully styled celebrations with thoughtful attention to detail.',
      ogImageUrl: HERO,
    },
  });

  const services = await Service.insertMany([
    {
      name: 'Event Dressing',
      description: 'Beautiful styling and decoration to transform your event space.',
      order: 1,
    },
    {
      name: 'Party Planning',
      description: 'Helping bring together the details needed for a memorable celebration.',
      order: 2,
    },
    {
      name: 'Balloon Styling',
      description: 'Elegant balloon arrangements and statement installations.',
      order: 3,
    },
    {
      name: 'Table Styling',
      description: 'Beautiful table arrangements designed to complement your celebration.',
      order: 4,
    },
    {
      name: 'Venue Decorations',
      description: 'Transforming event spaces with carefully selected decorative elements.',
      order: 5,
    },
    {
      name: 'Bespoke Event Styling',
      description: 'A personalised approach for customers looking for something unique.',
      order: 6,
    },
  ]);

  const categories = [
    'Birthdays',
    'Weddings',
    'Engagements',
    'Baby Showers',
    'Anniversaries',
    'Private Celebrations',
    'Corporate Events',
    'Special Occasions',
  ];
  await EventCategory.insertMany(
    categories.map((name, i) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      order: i + 1,
    }))
  );

  await Package.insertMany([
    {
      name: 'The Essential',
      description: 'For customers looking for elegant styling for a smaller celebration.',
      includedServices: ['Event Dressing', 'Table Styling'],
      optionalServices: ['Balloon Styling'],
      startingPrice: null,
      imageUrl: IMG.floralTable,
      order: 1,
    },
    {
      name: 'The Celebration',
      description: 'For customers looking for a more complete event styling experience.',
      includedServices: ['Event Dressing', 'Balloon Styling', 'Table Styling', 'Venue Decorations'],
      optionalServices: ['Party Planning'],
      startingPrice: null,
      imageUrl: IMG.celebrationHall,
      order: 2,
    },
    {
      name: 'The Signature',
      description: 'For customers looking for a bespoke event styling experience.',
      includedServices: [
        'Bespoke Event Styling',
        'Event Dressing',
        'Balloon Styling',
        'Table Styling',
        'Venue Decorations',
        'Party Planning',
      ],
      optionalServices: [],
      startingPrice: null,
      imageUrl: IMG.elegantReception,
      order: 3,
    },
  ]);

  await Event.insertMany([
    {
      title: 'Elegant Rose Gold Celebration',
      slug: 'elegant-rose-gold-celebration',
      category: 'Birthdays',
      date: new Date('2024-06-15'),
      location: 'Port Glasgow',
      description:
        'A warm, rose-gold celebration featuring statement balloons, soft blush accents and carefully styled table details. Demo portfolio entry — replace with your real event photographs and details.',
      servicesUsed: ['Event Dressing', 'Balloon Styling', 'Table Styling'],
      imageUrls: [HERO, IMG.roseGoldBalloons, IMG.champagneSetup],
      featured: true,
      order: 1,
    },
    {
      title: 'Luxury Birthday Styling',
      slug: 'luxury-birthday-styling',
      category: 'Birthdays',
      date: new Date('2024-08-20'),
      location: 'Inverclyde',
      description:
        'Birthday styling with elegant finishing touches. Demo content — update with your photographs.',
      servicesUsed: ['Event Dressing', 'Balloon Styling'],
      imageUrls: [IMG.birthdayParty, IMG.pastelBalloons, IMG.balloonArch],
      featured: true,
      order: 2,
    },
    {
      title: 'Beautiful Table Setting',
      slug: 'beautiful-table-setting',
      category: 'Weddings',
      date: new Date('2024-09-10'),
      location: 'Scotland',
      description:
        'Thoughtful table styling designed to complement the celebration. Demo portfolio entry.',
      servicesUsed: ['Table Styling', 'Venue Decorations'],
      imageUrls: [IMG.weddingTable, IMG.floralTable, IMG.candlelit],
      featured: true,
      order: 3,
    },
    {
      title: 'Statement Balloon Display',
      slug: 'statement-balloon-display',
      category: 'Parties',
      date: new Date('2024-10-05'),
      location: 'Port Glasgow',
      description:
        'A statement balloon installation as a focal point for the room. Demo content for the website proposal.',
      servicesUsed: ['Balloon Styling'],
      imageUrls: [IMG.balloonArch, IMG.roseGoldBalloons, HERO],
      featured: true,
      order: 4,
    },
  ]);

  await GalleryImage.insertMany([
    {
      title: 'Rose gold celebration focal point',
      category: 'Balloon Styling',
      description: 'Demo gallery image — replace with your event photography.',
      imageUrl: HERO,
      featured: true,
      order: 1,
    },
    {
      title: 'Celebration table styling',
      category: 'Table Styling',
      description: 'Demo gallery image.',
      imageUrl: IMG.weddingTable,
      featured: true,
      order: 2,
    },
    {
      title: 'Warm fairy light atmosphere',
      category: 'Venue Decorations',
      description: 'Demo gallery image.',
      imageUrl: IMG.fairyLights,
      featured: true,
      order: 3,
    },
    {
      title: 'Elegant event dressing',
      category: 'Event Dressing',
      description: 'Demo gallery image.',
      imageUrl: IMG.celebrationHall,
      featured: false,
      order: 4,
    },
    {
      title: 'Soft blush celebration details',
      category: 'Parties',
      description: 'Demo gallery image.',
      imageUrl: IMG.blushDecor,
      featured: false,
      order: 5,
    },
    {
      title: 'Statement balloon installation',
      category: 'Balloon Styling',
      description: 'Demo gallery image.',
      imageUrl: IMG.balloonArch,
      featured: false,
      order: 6,
    },
    {
      title: 'Floral table moments',
      category: 'Table Styling',
      description: 'Demo gallery image.',
      imageUrl: IMG.floralTable,
      featured: false,
      order: 7,
    },
    {
      title: 'Candlelit reception mood',
      category: 'Special Occasions',
      description: 'Demo gallery image.',
      imageUrl: IMG.candlelit,
      featured: false,
      order: 8,
    },
    {
      title: 'Champagne celebration styling',
      category: 'Event Dressing',
      description: 'Demo gallery image.',
      imageUrl: IMG.champagneSetup,
      featured: false,
      order: 9,
    },
    {
      title: 'Party colour and joy',
      category: 'Parties',
      description: 'Demo gallery image.',
      imageUrl: IMG.pastelBalloons,
      featured: false,
      order: 10,
    },
  ]);

  await Testimonial.insertMany([
    {
      customerName: 'Placeholder',
      eventType: 'Celebration',
      review: 'Customer testimonial will appear here.',
      photoUrl: '',
      date: new Date(),
      featured: true,
      isPlaceholder: true,
    },
    {
      customerName: 'Placeholder',
      eventType: 'Birthday',
      review: 'Customer testimonial will appear here.',
      photoUrl: '',
      date: new Date(),
      featured: true,
      isPlaceholder: true,
    },
    {
      customerName: 'Placeholder',
      eventType: 'Private Event',
      review: 'Customer testimonial will appear here.',
      photoUrl: '',
      date: new Date(),
      featured: true,
      isPlaceholder: true,
    },
  ]);

  console.log('Seed complete.');
  console.log('Admin login: admin@cupcakedreams.local / ChangeMe123!');
  console.log(`Services seeded: ${services.length}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
