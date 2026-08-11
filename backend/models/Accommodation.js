const mongoose = require('mongoose');

/**
 * Sub-schema for the per-category ratings shown on a listing page.
 * Stored as a nested object rather than its own collection because these
 * values only ever make sense in the context of their parent listing.
 */
const specificRatingsSchema = new mongoose.Schema(
  {
    cleanliness: { type: Number, min: 0, max: 5, default: 0 },
    communication: { type: Number, min: 0, max: 5, default: 0 },
    checkIn: { type: Number, min: 0, max: 5, default: 0 },
    accuracy: { type: Number, min: 0, max: 5, default: 0 },
    location: { type: Number, min: 0, max: 5, default: 0 },
    value: { type: Number, min: 0, max: 5, default: 0 },
  },
  { _id: false }
);

/**
 * Accommodation schema — one rentable listing.
 * `host_id` is the authoritative link to the owning User; `host` is the
 * display name denormalised onto the listing so the common read path
 * (browsing listings) does not need a populate.
 */
const accommodationSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      required: [true, 'Accommodation type is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    guests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    amenities: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    host: { type: String, required: true, trim: true },
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weeklyDiscount: { type: Number, min: 0, default: 0 },
    cleaningFee: { type: Number, min: 0, default: 0 },
    serviceFee: { type: Number, min: 0, default: 0 },
    occupancyTaxes: { type: Number, min: 0, default: 0 },
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },
    description: { type: String, default: '', trim: true },
    specificRatings: {
      type: specificRatingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
