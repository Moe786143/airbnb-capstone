const express = require('express');
const {
  createReservation,
  getHostReservations,
  getUserReservations,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Every reservation route requires a logged-in user, so apply the guard once
// here rather than repeating it on each route below.
router.use(protect);

// Create a booking.
router.post('/', createReservation);

// These two literal paths must be declared before any '/:id' route would be,
// otherwise Express would match 'host' and 'user' as an :id parameter.
router.get('/host', getHostReservations);
router.get('/user', getUserReservations);

// Cancel a booking (guest or host of that booking).
router.delete('/:id', deleteReservation);

module.exports = router;
