const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

/** Number of milliseconds in one day — used to convert a date range to nights. */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Guests beyond this many cost extra — mirrors the frontend's
// BASE_INCLUDED_GUESTS in utils/format.js. Keep the two in sync.
const BASE_INCLUDED_GUESTS = 2;
const EXTRA_GUEST_FEE_PER_NIGHT = 15;
const EXTRA_GUEST_CLEANING_FEE = 10;

/**
 * Work out what a stay costs, server-side, from the listing's own pricing.
 * The client never gets to set its own total — it may send one, but this
 * value is what gets stored.
 *
 * Formula: (nightly rate x nights) + extra-guest fee - weekly discount +
 * cleaning + service + taxes. The weekly discount is a percentage applied
 * to the nightly subtotal for stays of 7 nights or more. The extra-guest
 * fee, and a bump to the cleaning fee, only apply once the party is
 * bigger than BASE_INCLUDED_GUESTS — more guests means more rooms to
 * turn over and more wear on the place.
 *
 * @param {object} accommodation - the listing being booked
 * @param {number} nights - length of the stay in nights
 * @param {number} guests - size of the party
 * @returns {number} the total cost, rounded to 2 decimal places
 */
const calculateTotalCost = (accommodation, nights, guests) => {
  const nightlySubtotal = accommodation.price * nights;

  const extraGuests = Math.max(0, (guests || 1) - BASE_INCLUDED_GUESTS);
  const extraGuestFee = extraGuests * EXTRA_GUEST_FEE_PER_NIGHT * nights;

  const discount =
    nights >= 7 && accommodation.weeklyDiscount
      ? nightlySubtotal * (accommodation.weeklyDiscount / 100)
      : 0;

  const cleaningFee = (accommodation.cleaningFee || 0) + extraGuests * EXTRA_GUEST_CLEANING_FEE;

  const total =
    nightlySubtotal +
    extraGuestFee -
    discount +
    cleaningFee +
    (accommodation.serviceFee || 0) +
    (accommodation.occupancyTaxes || 0);

  return Math.round(total * 100) / 100;
};

/**
 * POST /api/reservations
 * Protected. Books a listing for the logged-in user.
 *
 * Body: { accommodation_id, checkIn, checkOut, guests }
 * `user_id` comes from the token and `host_id` / `totalCost` are derived
 * from the listing, so none of the three can be forged by the client.
 *
 * Responses: 201 created | 400 validation error | 401 | 404 listing gone |
 *            409 dates already booked | 500
 */
const createReservation = async (req, res) => {
  try {
    const { accommodation_id, checkIn, checkOut, guests } = req.body;

    // --- Input validation ------------------------------------------------
    if (!accommodation_id || !checkIn || !checkOut || guests === undefined) {
      return res.status(400).json({
        message:
          'accommodation_id, checkIn, checkOut and guests are all required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(accommodation_id)) {
      return res.status(400).json({ message: 'Invalid accommodation_id' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: 'checkIn and checkOut must be valid dates (e.g. 2026-09-01)',
      });
    }
    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: 'checkOut must be after checkIn' });
    }

    const guestCount = Number(guests);
    if (Number.isNaN(guestCount) || guestCount < 1) {
      return res
        .status(400)
        .json({ message: 'guests must be a number of at least 1' });
    }

    const accommodation = await Accommodation.findById(accommodation_id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // A host booking their own place is almost always a mistake.
    if (accommodation.host_id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You cannot book your own listing' });
    }

    if (guestCount > accommodation.guests) {
      return res.status(400).json({
        message: `This listing accommodates a maximum of ${accommodation.guests} guests`,
      });
    }

    // Reject a stay that overlaps an existing booking. Two ranges overlap
    // when each starts before the other ends; same-day turnover (one guest
    // checking out as another checks in) is allowed.
    const conflict = await Reservation.findOne({
      accommodation_id,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (conflict) {
      return res.status(409).json({
        message: 'Those dates are already booked for this listing',
      });
    }

    const nights = Math.round((checkOutDate - checkInDate) / MS_PER_DAY);

    const reservation = await Reservation.create({
      accommodation_id,
      user_id: req.user._id,
      host_id: accommodation.host_id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
      totalCost: calculateTotalCost(accommodation, nights, guestCount),
    });

    return res.status(201).json(reservation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Server error while creating reservation',
      error: error.message,
    });
  }
};

/**
 * GET /api/reservations/host
 * Protected. Every reservation made against listings owned by the
 * logged-in host, newest first, with the listing and guest details
 * populated so a host dashboard can render in one request.
 *
 * Responses: 200 ok | 401 | 500
 */
const getHostReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host_id: req.user._id })
      .populate('accommodation_id', 'title location images price type')
      .populate('user_id', 'username')
      .sort('-createdAt');

    return res
      .status(200)
      .json({ count: reservations.length, reservations });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching host reservations',
      error: error.message,
    });
  }
};

/**
 * GET /api/reservations/user
 * Protected. Every reservation the logged-in user has made as a guest,
 * newest first, with listing details populated for the trips page.
 *
 * Responses: 200 ok | 401 | 500
 */
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_id: req.user._id })
      .populate('accommodation_id', 'title location images price type')
      .populate('host_id', 'username')
      .sort('-createdAt');

    return res
      .status(200)
      .json({ count: reservations.length, reservations });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching your reservations',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/reservations/:id
 * Protected. Cancels a reservation. Either party may cancel: the guest who
 * booked it, or the host of the listing.
 *
 * Responses: 200 deleted | 400 | 401 | 403 not your reservation | 404 | 500
 */
const deleteReservation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid reservation id' });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const userId = req.user._id.toString();
    const isGuest = reservation.user_id.toString() === userId;
    const isHost = reservation.host_id.toString() === userId;

    if (!isGuest && !isHost) {
      return res.status(403).json({
        message: 'Forbidden: you can only cancel your own reservations',
      });
    }

    await reservation.deleteOne();

    return res.status(200).json({
      message: 'Reservation cancelled successfully',
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while cancelling reservation',
      error: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getHostReservations,
  getUserReservations,
  deleteReservation,
};
