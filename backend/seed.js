/**
 * Database seed script.
 *
 * Wipes the users, accommodations and reservations collections and repopulates
 * them with 2 users (one host, one guest) and 8 sample accommodations owned by
 * the host.
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

/**
 * Build the 8 sample listings. Takes the host document so each listing can
 * carry the correct host_id / host name.
 *
 * @param {object} host - the seeded host user
 * @returns {object[]} accommodation documents ready to insert
 */
const buildAccommodations = (host) => [
  {
    title: 'Sunlit Loft in the Marais',
    type: 'Entire loft',
    location: 'Paris, France',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
    ],
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Wifi', 'Kitchen', 'Washer', 'Heating', 'Dedicated workspace'],
    rating: 4.92,
    reviews: 178,
    price: 165,
    weeklyDiscount: 12,
    cleaningFee: 45,
    serviceFee: 32,
    occupancyTaxes: 21,
    enhancedCleaning: true,
    selfCheckIn: true,
    description:
      'A bright top-floor loft with exposed beams, five minutes from Place des Vosges. Big windows, a proper espresso machine, and a quiet street below.',
    specificRatings: {
      cleanliness: 4.9, communication: 5.0, checkIn: 4.9,
      accuracy: 4.8, location: 5.0, value: 4.7,
    },
  },
  {
    title: 'Cliffside Cabin with Ocean Views',
    type: 'Entire cabin',
    location: 'Big Sur, California',
    images: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    ],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Wifi', 'Kitchen', 'Free parking', 'Fireplace', 'Hot tub'],
    rating: 4.98,
    reviews: 96,
    price: 320,
    weeklyDiscount: 15,
    cleaningFee: 90,
    serviceFee: 61,
    occupancyTaxes: 38,
    enhancedCleaning: true,
    selfCheckIn: false,
    description:
      'Timber cabin perched above the Pacific. Wake up to fog rolling through the redwoods and watch the sun drop into the ocean from the deck.',
    specificRatings: {
      cleanliness: 5.0, communication: 4.9, checkIn: 4.9,
      accuracy: 5.0, location: 5.0, value: 4.8,
    },
  },
  {
    title: 'Minimalist Studio near Shibuya',
    type: 'Entire apartment',
    location: 'Tokyo, Japan',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    ],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'Washer', 'TV'],
    rating: 4.85,
    reviews: 243,
    price: 98,
    weeklyDiscount: 10,
    cleaningFee: 30,
    serviceFee: 19,
    occupancyTaxes: 12,
    enhancedCleaning: true,
    selfCheckIn: true,
    description:
      'Compact and calm, two subway stops from Shibuya Crossing. Everything you need, nothing you do not — including a genuinely comfortable futon.',
    specificRatings: {
      cleanliness: 4.9, communication: 4.8, checkIn: 4.9,
      accuracy: 4.8, location: 4.9, value: 4.8,
    },
  },
  {
    title: 'Whitewashed Villa with Infinity Pool',
    type: 'Entire villa',
    location: 'Santorini, Greece',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    ],
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Wifi', 'Pool', 'Kitchen', 'Air conditioning', 'Free parking', 'BBQ grill'],
    rating: 4.94,
    reviews: 134,
    price: 540,
    weeklyDiscount: 18,
    cleaningFee: 150,
    serviceFee: 102,
    occupancyTaxes: 74,
    enhancedCleaning: true,
    selfCheckIn: false,
    description:
      'Carved into the caldera cliffs in Oia. Four bedrooms, an infinity pool that runs right to the edge, and the best sunset on the island from the terrace.',
    specificRatings: {
      cleanliness: 4.9, communication: 5.0, checkIn: 4.8,
      accuracy: 4.9, location: 5.0, value: 4.7,
    },
  },
  {
    title: 'Converted Warehouse in Shoreditch',
    type: 'Entire apartment',
    location: 'London, United Kingdom',
    images: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    ],
    guests: 5,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Wifi', 'Kitchen', 'Washer', 'Dryer', 'Heating', 'Dedicated workspace'],
    rating: 4.78,
    reviews: 211,
    price: 210,
    weeklyDiscount: 8,
    cleaningFee: 60,
    serviceFee: 40,
    occupancyTaxes: 28,
    enhancedCleaning: false,
    selfCheckIn: true,
    description:
      'Brick walls, steel windows and a kitchen island the size of a small car. Markets, coffee and the Overground all within a short walk.',
    specificRatings: {
      cleanliness: 4.7, communication: 4.8, checkIn: 4.9,
      accuracy: 4.7, location: 4.9, value: 4.6,
    },
  },
  {
    title: 'Desert A-Frame under the Stars',
    type: 'Entire home',
    location: 'Joshua Tree, California',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    ],
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Wifi', 'Kitchen', 'Free parking', 'Hot tub', 'Fire pit', 'Air conditioning'],
    rating: 4.89,
    reviews: 157,
    price: 245,
    weeklyDiscount: 14,
    cleaningFee: 75,
    serviceFee: 46,
    occupancyTaxes: 30,
    enhancedCleaning: true,
    selfCheckIn: true,
    description:
      'An off-grid A-frame ten minutes from the park entrance. No neighbours, no light pollution, and a hot tub pointed straight at the Milky Way.',
    specificRatings: {
      cleanliness: 4.9, communication: 4.9, checkIn: 5.0,
      accuracy: 4.8, location: 4.8, value: 4.8,
    },
  },
  {
    title: 'Colonial Townhouse in Roma Norte',
    type: 'Entire townhouse',
    location: 'Mexico City, Mexico',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    ],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Wifi', 'Kitchen', 'Washer', 'Patio', 'Dedicated workspace', 'TV'],
    rating: 4.91,
    reviews: 189,
    price: 130,
    weeklyDiscount: 11,
    cleaningFee: 40,
    serviceFee: 25,
    occupancyTaxes: 16,
    enhancedCleaning: true,
    selfCheckIn: true,
    description:
      'High ceilings, patterned tile floors and a courtyard full of plants. Steps from the taquerias and bookshops of Roma Norte.',
    specificRatings: {
      cleanliness: 4.9, communication: 5.0, checkIn: 4.9,
      accuracy: 4.9, location: 4.9, value: 4.9,
    },
  },
  {
    title: 'Alpine Chalet with Mountain Terrace',
    type: 'Entire chalet',
    location: 'Zermatt, Switzerland',
    images: [
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb',
      'https://images.unsplash.com/photo-1517320964276-a002fa203177',
    ],
    guests: 10,
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['Wifi', 'Kitchen', 'Fireplace', 'Heating', 'Ski-in/ski-out', 'Sauna'],
    rating: 4.96,
    reviews: 88,
    price: 690,
    weeklyDiscount: 20,
    cleaningFee: 180,
    serviceFee: 130,
    occupancyTaxes: 95,
    enhancedCleaning: true,
    selfCheckIn: false,
    description:
      'A five-bedroom chalet with the Matterhorn framed in the living room window. Ski straight to the door, then thaw out in the sauna.',
    specificRatings: {
      cleanliness: 5.0, communication: 4.9, checkIn: 4.9,
      accuracy: 5.0, location: 5.0, value: 4.8,
    },
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
