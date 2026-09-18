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

// Where backend/server.js serves backend/public/images/* from — kept in
// sync with the admin app's default API host (http://localhost:5000).
const IMAGE_BASE = `http://localhost:${process.env.PORT || 5000}/images`;

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
    images: [`${IMAGE_BASE}/sandton-city-hotel.png`],
    guests: 6,
    guestsLabel: '4-6 guests',
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['Wifi', 'Kitchen', 'Free Parking'],
    rating: 5.0,
    reviews: 318,
    price: 325,
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
  host: host.username,
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
