const mongoose = require('mongoose');

/**
 * Reservation schema — one booking of one accommodation by one guest.
 * `host_id` is copied from the accommodation at creation time so the
 * "reservations for my listings" query is a single indexed lookup rather
 * than a join through the accommodations collection.
 */
const reservationSchema = new mongoose.Schema({
  accommodation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: [true, 'accommodation_id is required'],
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  host_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  checkIn: {
    type: Date,
    required: [true, 'checkIn date is required'],
  },
  checkOut: {
    type: Date,
    required: [true, 'checkOut date is required'],
  },
  guests: {
    type: Number,
    required: true,
    min: [1, 'A reservation must be for at least 1 guest'],
  },
  totalCost: {
    type: Number,
    required: true,
    min: [0, 'totalCost cannot be negative'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Schema-level guard: check-out must be strictly after check-in.
 * Lives here as well as in the controller so that any future code path
 * (seed script, admin tool) cannot write a nonsensical date range.
 */
reservationSchema.pre('validate', function validateDateRange(next) {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    return next(new Error('checkOut must be after checkIn'));
  }
  return next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
