/**
 * Database seed script.
 *
 * Wipes the users, accommodations and reservations collections and repopulates
 * them with 2 users (one host, one guest) and the 3 sample accommodations
 * shown in the "My Hotel List" Figma design, owned by the host.
 *
 * Run with:  npm run seed
 * Destructive — never point this at a production database.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');
const Reservation = require('./models/Reservation');

/**
 * The two demo accounts. Passwords are plain text here and get hashed by the
 * User model's pre-save hook, which is why the script uses `User.create`
 * rather than `insertMany` with raw documents.
 */
const users = [
  { username: 'sarahhost', password: 'password123', role: 'host' },
  { username: 'jamesguest', password: 'password123', role: 'user' },
];

// Where backend/server.js serves backend/public/images/* from. Defaults to
// localhost for local dev, but MUST be overridden with the backend's real
// public URL (e.g. https://your-backend.vercel.app) via BACKEND_PUBLIC_URL
// when seeding a deployed database — otherwise every seeded image URL
// bakes in "localhost", which doesn't resolve for anyone but whoever is
// running this script.
const IMAGE_BASE =
  `${process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`}/images`;

/**
 * Build the 3 sample listings. Takes the host document so each listing can
 * carry the correct host_id / host name.
 *
 * @param {object} host - the seeded host user
 * @returns {object[]} accommodation documents ready to insert
 */
const buildAccommodations = (host) => [
  {
    title: 'Sandton City Hotel',
    subtitle: '3 Room Bedroom',
    type: 'Entire Home',
    location: 'Sandton, Johannesburg',
    images: [
      `${IMAGE_BASE}/sandton-city-hotel-1.png`,
      `${IMAGE_BASE}/sandton-city-hotel-2.png`,
      `${IMAGE_BASE}/sandton-city-hotel-3.png`,
      `${IMAGE_BASE}/sandton-city-hotel-4.png`,
      `${IMAGE_BASE}/sandton-city-hotel-5.png`,
    ],
    guests: 6,
    guestsLabel: '4-6 guests',
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['Wifi', 'Kitchen', 'Free Parking'],
    rating: 5.0,
    reviews: 318,
    price: 325,
    description:
      "Escape to this stylish 5-bedroom home in the heart of Sandton, Johannesburg, walking distance from Sandton City and the Gautrain station. The open-plan living area is filled with natural light, the kitchen comes fully equipped for longer stays, and each bedroom offers its own quiet retreat after a day exploring the city. Free parking is available on-site, and the neighbourhood's restaurants, shops, and nightlife are all just minutes away on foot. Perfect for families, groups, or business travellers who want comfort without sacrificing convenience.",
  },
  {
    title: 'Woodmead City Hotel',
    subtitle: 'Entire home in Bordeaux',
    type: 'Entire Home',
    location: 'Bordeaux, France',
    images: [`${IMAGE_BASE}/woodmead-city-hotel.png`],
    guests: 6,
    guestsLabel: '4-6 guests',
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['Wifi', 'Kitchen', 'Free Parking'],
    rating: 5.0,
    reviews: 318,
    // No price in the Figma design for this listing — left unset rather
    // than guessed, so the admin card matches exactly (no "/night" line).
  },
  {
    title: 'Historic City Center Home',
    subtitle: 'Entire home in Bordeaux',
    type: 'Entire Home',
    location: 'Bordeaux, France',
    images: [`${IMAGE_BASE}/historic-city-center-home.png`],
    guests: 6,
    guestsLabel: '4-6 guests',
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['Wifi', 'Kitchen', 'Free Parking'],
    rating: 5.0,
    reviews: 318,
    price: 125,
  },
].map((accommodation) => ({
  ...accommodation,
  // A readable display name for the listing pages — kept separate from
  // `host.username` (the login credential), which stays as "sarahhost".
  host: 'Sarah',
  host_id: host._id,
}));

/**
 * Clear the three collections and insert the sample data, then disconnect.
 * Exits with a non-zero code on failure so a CI step would catch it.
 */
const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment. Copy .env.example to .env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Order matters only for readability here — reservations reference both
    // of the other collections, so clear it first.
    await Reservation.deleteMany({});
    await Accommodation.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing users, accommodations and reservations');

    // `create` (not `insertMany`) so the password-hashing hook runs.
    const [host, guest] = await User.create(users);
    console.log(`Created 2 users: ${host.username} (host), ${guest.username} (user)`);

    const created = await Accommodation.insertMany(buildAccommodations(host));
    console.log(`Created ${created.length} accommodations`);

    console.log('\nSeed complete. Log in with either account:');
    console.log('  host  -> username: sarahhost    password: password123');
    console.log('  guest -> username: jamesguest   password: password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
