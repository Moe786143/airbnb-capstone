const express = require('express');
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  // Public: browse listings, with optional ?location= and other filters.
  .get(getAccommodations)
  // Protected: only an account with the 'host' role can publish a listing.
  .post(protect, restrictTo('host'), createAccommodation);

router
  .route('/:id')
  // Public: view one listing.
  .get(getAccommodationById)
  // Protected: ownership is checked inside the controller.
  .put(protect, updateAccommodation)
  .delete(protect, deleteAccommodation);

module.exports = router;
